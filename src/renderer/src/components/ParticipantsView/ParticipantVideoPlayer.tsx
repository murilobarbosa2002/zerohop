import { useEffect, useReducer, useRef, useState } from 'react';
import { VolumeControl } from '@/components/ParticipantsView/VolumeControl';
import { ParticipantVideoLightbox } from '@/components/ParticipantsView/ParticipantVideoLightbox';
import { useAudioOutputDevice } from '@/hooks/useAudioOutputDevice';
import { setElementAudioOutput } from '@/lib/audioSink';
import { COMMON_STRINGS } from '@/strings/common.strings';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import type { ParticipantVideoPlayerProps } from '@/components/ParticipantsView/ParticipantVideoPlayer.types';

export function ParticipantVideoPlayer({ member, audioState }: ParticipantVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const state = audioState.get(member.id);
  const [, forceRender] = useReducer((renderCount: number) => renderCount + 1, 0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasAudio = member.stream.getAudioTracks().length > 0;
  const [audioOutputDeviceId] = useAudioOutputDevice();

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = member.stream;
  }, [member.stream]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = state.volume;
    videoRef.current.muted = state.muted;
  }, [state.volume, state.muted]);

  useEffect(() => {
    if (videoRef.current) setElementAudioOutput(videoRef.current, audioOutputDeviceId);
  }, [audioOutputDeviceId]);

  function toggleMute(): void {
    state.muted = !state.muted;
    forceRender();
  }

  function changeVolume(volume: number): void {
    state.volume = volume;
    forceRender();
  }

  return (
    <div>
      <div className="relative mt-2.5">
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-2 right-2 bg-panel-2 border border-border text-text px-2.5 py-1.5 text-xs hover:border-accent"
        >
          {COMMON_STRINGS.fullscreenButton}
        </button>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full aspect-video min-h-video-min max-h-video resize-y overflow-hidden object-contain bg-black rounded-lg border border-border block"
        />
      </div>
      {lightboxOpen && (
        <ParticipantVideoLightbox stream={member.stream} volume={state.volume} muted={state.muted} onClose={() => setLightboxOpen(false)} />
      )}
      {hasAudio ? (
        <VolumeControl muted={state.muted} volume={state.volume} onToggleMute={toggleMute} onChangeVolume={changeVolume} />
      ) : (
        <p className="text-text-dim text-xs py-2.5">{PARTICIPANTS_STRINGS.noAudioMessage}</p>
      )}
    </div>
  );
}
