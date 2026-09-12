import { useEffect, useReducer, useRef } from 'react';
import { VolumeControl } from '@/components/ParticipantsView/VolumeControl';
import { COMMON_STRINGS } from '@/strings/common.strings';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import type { ParticipantVideoPlayerProps } from '@/components/ParticipantsView/ParticipantVideoPlayer.types';

export function ParticipantVideoPlayer({ member, audioState }: ParticipantVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const state = audioState.get(member.id);
  const [, forceRender] = useReducer((renderCount: number) => renderCount + 1, 0);
  const hasAudio = member.stream.getAudioTracks().length > 0;

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = member.stream;
    videoRef.current.volume = state.volume;
    videoRef.current.muted = state.muted;
  }, [member.stream, state.volume, state.muted]);

  function handleFullscreen(): void {
    videoRef.current?.requestFullscreen().catch(() => {});
  }

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
          onClick={handleFullscreen}
          className="absolute top-2 right-2 z-10 bg-black/70 border border-border text-text rounded-lg px-2.5 py-1.5 text-xs hover:bg-black/90 hover:border-accent"
        >
          {COMMON_STRINGS.fullscreenButton}
        </button>
        <video ref={videoRef} autoPlay playsInline className="w-full max-h-video bg-black rounded-lg border border-border block" />
      </div>
      {hasAudio ? (
        <VolumeControl muted={state.muted} volume={state.volume} onToggleMute={toggleMute} onChangeVolume={changeVolume} />
      ) : (
        <p className="text-text-dim text-xs py-2.5">{PARTICIPANTS_STRINGS.noAudioMessage}</p>
      )}
    </div>
  );
}
