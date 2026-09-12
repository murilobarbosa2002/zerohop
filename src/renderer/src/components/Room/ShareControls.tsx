import { useEffect, useRef, useState } from 'react';
import { ShareIdleTrigger } from '@/components/Room/ShareIdleTrigger';
import { ShareSourcePicker } from '@/components/Room/ShareSourcePicker';
import { ShareActiveStatus } from '@/components/Room/ShareActiveStatus';
import { useAudioSourceOptions, resolveAudioSourceId } from '@/hooks/useAudioSourceOptions';
import { captureSource, boostVideoBitrate } from '@/services/ScreenCapture';
import { errorMessage } from '@/lib/errorMessage';
import { onTyped } from '@/lib/typedEvents';
import { Resolution, DEFAULT_RESOLUTION } from '@/constants/resolution';
import { Fps, DEFAULT_FPS } from '@/constants/fps';
import { DEFAULT_AUDIO_SOURCE_MODE } from '@/constants/audioSourceMode';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomClientEventDetail } from '@/services/RoomClient';
import type { ShareControlsProps } from '@/components/Room/ShareControls.types';

function parseResolution(resolution: Resolution): { width: number; height: number } {
  const [width, height] = resolution.split('x').map(Number);
  return { width, height };
}

export function ShareControls({ roomClient, sourcePicker, sharing }: ShareControlsProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [resolution, setResolution] = useState<Resolution>(DEFAULT_RESOLUTION);
  const [fps, setFps] = useState<Fps>(DEFAULT_FPS);
  const [audioSelection, setAudioSelection] = useState<string>(DEFAULT_AUDIO_SOURCE_MODE);
  const [status, setStatus] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioOptions = useAudioSourceOptions(sourcePicker.sources);

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

  function handleStop(): void {
    roomClient.stopSharing();
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setStatus('');
  }

  async function handleStart(): Promise<void> {
    if (!sourcePicker.selectedId) {
      setStatus(ROOM_STRINGS.chooseSourceFirstError);
      return;
    }

    const quality = { ...parseResolution(resolution), fps: Number(fps) };
    const audioSourceId = resolveAudioSourceId(audioSelection, sourcePicker.selectedId);

    let stream: MediaStream;
    let audioFellBack = false;
    try {
      stream = await captureSource(sourcePicker.selectedId, audioSourceId, quality);
    } catch (error) {
      if (!audioSourceId) {
        setStatus(ROOM_STRINGS.captureError(errorMessage(error)));
        return;
      }
      try {
        stream = await captureSource(sourcePicker.selectedId, null, quality);
        audioFellBack = true;
      } catch (fallbackError) {
        setStatus(ROOM_STRINGS.captureError(errorMessage(fallbackError)));
        return;
      }
    }

    roomClient.startSharing(stream, quality);
    setLocalStream(stream);
    setStatus(audioFellBack ? ROOM_STRINGS.sharingAudioFallbackStatus : ROOM_STRINGS.sharingWithAudioStatus);
  }

  return sharing ? (
    <ShareActiveStatus status={status} onStop={handleStop} videoRef={videoRef} />
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
