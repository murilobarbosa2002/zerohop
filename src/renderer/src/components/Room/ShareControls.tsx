import { useEffect, useRef, useState } from 'react';
import { Card, CardTitle } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { SelectField } from '@/components/SelectField';
import { SourceGrid } from '@/components/Room/SourceGrid';
import { RESOLUTION_OPTIONS, FPS_OPTIONS } from '@/components/Room/qualityOptions';
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

  async function handleToggle(): Promise<void> {
    if (sharing) {
      roomClient.stopSharing();
      localStream?.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      setStatus('');
      return;
    }

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

  return (
    <Card>
      <CardTitle badge={1}>{ROOM_STRINGS.chooseSourceTitle}</CardTitle>
      <SourceGrid sources={sourcePicker.sources} selectedId={sourcePicker.selectedId} onSelect={sourcePicker.select} />
      <ActionButton onClick={() => sourcePicker.refresh()}>{ROOM_STRINGS.refreshSourcesButton}</ActionButton>

      <div className="flex gap-5 mt-3.5 flex-wrap items-end">
        <SelectField
          label={ROOM_STRINGS.resolutionFieldLabel}
          value={resolution}
          onChange={(value) => setResolution(value as Resolution)}
          options={RESOLUTION_OPTIONS}
        />
        <SelectField
          label={ROOM_STRINGS.fpsFieldLabel}
          value={fps}
          onChange={(value) => setFps(value as Fps)}
          options={FPS_OPTIONS}
        />
        <SelectField
          label={ROOM_STRINGS.audioFieldLabel}
          value={audioSelection}
          onChange={setAudioSelection}
          options={audioOptions}
        />
        <ActionButton variant="primary" onClick={handleToggle}>
          {sharing ? ROOM_STRINGS.stopSharingButton : ROOM_STRINGS.startSharingButton}
        </ActionButton>
      </div>

      <p className="text-text-dim text-xs leading-relaxed mt-2.5">{ROOM_STRINGS.qualityHint}</p>
      <p className="text-text-dim text-xs leading-relaxed mt-2.5">{ROOM_STRINGS.audioIndependenceHint}</p>

      {localStream && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-h-video bg-black rounded-lg border border-border mt-2.5 block"
        />
      )}

      {status && <p className="text-text-dim text-xs mt-2.5">{status}</p>}
    </Card>
  );
}
