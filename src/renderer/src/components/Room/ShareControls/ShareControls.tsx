import { useEffect, useRef, useState } from 'react';
import { ShareIdleTrigger } from '@/components/Room/ShareControls/ShareIdleTrigger';
import { ShareSourcePicker } from '@/components/Room/ShareControls/ShareSourcePicker';
import { ShareActiveStatus } from '@/components/Room/ShareControls/ShareActiveStatus';
import { useAudioSourceOptions, resolveAudioSourceId } from '@/hooks/useAudioSourceOptions';
import { useExperimentalPerAppAudio } from '@/hooks/useExperimentalPerAppAudio';
import { captureSource, captureSourceWithProcessAudio } from '@/services/ScreenCapture';
import { playShareStartSound, playShareStopSound, playShareSaveChangesSound, playErrorSound } from '@/services/soundEffects';
import { boostVideoBitrate } from '@/services/room/videoBitrate';
import { errorMessage } from '@/lib/errorMessage';
import { onTyped } from '@/lib/typedEvents';
import { getCaptureSourceKind } from '@/lib/captureSourceKind';
import { CaptureSourceKind } from '@/constants/captureSourceKind';
import { Resolution, DEFAULT_RESOLUTION } from '@/constants/resolution';
import { Fps, DEFAULT_FPS } from '@/constants/fps';
import { DEFAULT_AUDIO_SOURCE_MODE } from '@/constants/audioSourceMode';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomClientEventDetail } from '@/services/RoomClient';
import type { ShareControlsProps } from '@/components/Room/ShareControls/ShareControls.types';

function parseResolution(resolution: Resolution): { width: number; height: number } {
  const [width, height] = resolution.split('x').map(Number);
  return { width, height };
}

export function ShareControls({ roomClient, sourcePicker, sharing }: ShareControlsProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingWhileSharing, setEditingWhileSharing] = useState(false);
  const [resolution, setResolution] = useState<Resolution>(DEFAULT_RESOLUTION);
  const [fps, setFps] = useState<Fps>(DEFAULT_FPS);
  const [audioSelection, setAudioSelection] = useState<string>(DEFAULT_AUDIO_SOURCE_MODE);
  const [status, setStatus] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioOptions = useAudioSourceOptions(sourcePicker.sources);
  const experimentalPerAppAudio = useExperimentalPerAppAudio();

  useEffect(
    () =>
      onTyped<RoomClientEventDetail['outgoing-call']>(roomClient, 'outgoing-call', ({ call, quality }) => {
        if (call.peerConnection && quality) boostVideoBitrate(call.peerConnection, quality);
      }),
    [roomClient]
  );

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (sharing) setPanelOpen(false);
  }, [sharing]);

  useEffect(() => {
    const pickerVisible = panelOpen || (sharing && editingWhileSharing);
    sourcePicker.setWatching(pickerVisible);
    return () => sourcePicker.setWatching(false);
  }, [panelOpen, sharing, editingWhileSharing, sourcePicker]);

  function handleStop(): void {
    roomClient.stopSharing();
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setStatus('');
    playShareStopSound();
  }

  async function handleStart(): Promise<void> {
    if (!sourcePicker.selectedId) {
      setStatus(ROOM_STRINGS.chooseSourceFirstError);
      playErrorSound();
      return;
    }

    const quality = { ...parseResolution(resolution), fps: Number(fps) };
    const audioSourceId = resolveAudioSourceId(audioSelection, sourcePicker.selectedId);
    const isWindowSource = getCaptureSourceKind(sourcePicker.selectedId) === CaptureSourceKind.WINDOW;

    let stream: MediaStream;
    let audioFellBack = false;

    if (experimentalPerAppAudio && isWindowSource && audioSourceId) {
      const audioWindowTitle = sourcePicker.sources.find((source) => source.id === audioSourceId)?.name ?? '';
      try {
        stream = await captureSourceWithProcessAudio(sourcePicker.selectedId, audioWindowTitle, quality);
      } catch (error) {
        setStatus(ROOM_STRINGS.captureError(errorMessage(error)));
        playErrorSound();
        return;
      }
    } else {
      try {
        stream = await captureSource(sourcePicker.selectedId, audioSourceId, quality);
      } catch (error) {
        if (!audioSourceId) {
          setStatus(ROOM_STRINGS.captureError(errorMessage(error)));
          playErrorSound();
          return;
        }
        try {
          stream = await captureSource(sourcePicker.selectedId, null, quality);
          audioFellBack = true;
        } catch (fallbackError) {
          setStatus(ROOM_STRINGS.captureError(errorMessage(fallbackError)));
          playErrorSound();
          return;
        }
      }
    }

    if (editingWhileSharing) {
      roomClient.changeSharing(stream, quality);
      setEditingWhileSharing(false);
      playShareSaveChangesSound();
    } else {
      roomClient.startSharing(stream, quality);
      playShareStartSound();
    }
    setLocalStream(stream);
    setStatus(audioFellBack ? ROOM_STRINGS.sharingAudioFallbackStatus : ROOM_STRINGS.sharingWithAudioStatus);
  }

  if (sharing && editingWhileSharing) {
    return (
      <ShareSourcePicker
        sourcePicker={sourcePicker}
        resolution={resolution}
        onChangeResolution={setResolution}
        fps={fps}
        onChangeFps={setFps}
        audioSelection={audioSelection}
        onChangeAudioSelection={setAudioSelection}
        audioOptions={audioOptions}
        status={status}
        isEditing
        onConfirm={handleStart}
        onCancel={() => setEditingWhileSharing(false)}
      />
    );
  }

  return sharing ? (
    <ShareActiveStatus
      status={status}
      onStop={handleStop}
      onEdit={() => {
        setEditingWhileSharing(true);
        sourcePicker.refresh();
      }}
      videoRef={videoRef}
      localStream={localStream}
    />
  ) : panelOpen ? (
    <ShareSourcePicker
      sourcePicker={sourcePicker}
      resolution={resolution}
      onChangeResolution={setResolution}
      fps={fps}
      onChangeFps={setFps}
      audioSelection={audioSelection}
      onChangeAudioSelection={setAudioSelection}
      audioOptions={audioOptions}
      status={status}
      isEditing={false}
      onConfirm={handleStart}
      onCancel={() => setPanelOpen(false)}
    />
  ) : (
    <ShareIdleTrigger
      onOpen={() => {
        setPanelOpen(true);
        sourcePicker.refresh();
      }}
    />
  );
}
