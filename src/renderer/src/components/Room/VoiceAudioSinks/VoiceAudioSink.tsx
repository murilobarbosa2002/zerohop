import { useEffect, useReducer, useRef } from 'react';
import { useAudioOutputDevice } from '@/hooks/useAudioOutputDevice';
import { setElementAudioOutput } from '@/lib/audioSink';
import type { VoiceAudioSinkProps } from '@/components/Room/VoiceAudioSinks/VoiceAudioSinks.types';

export function VoiceAudioSink({ member, voiceAudioState, deafened }: VoiceAudioSinkProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [, forceRender] = useReducer((renderCount: number) => renderCount + 1, 0);
  const state = voiceAudioState.get(member.id);
  const [audioOutputDeviceId] = useAudioOutputDevice();

  useEffect(() => voiceAudioState.subscribe(member.id, forceRender), [voiceAudioState, member.id]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.srcObject = member.voiceStream;
    audioRef.current.volume = state.volume;
    audioRef.current.muted = deafened || state.muted;
  }, [member.voiceStream, state.volume, state.muted, deafened]);

  useEffect(() => {
    if (audioRef.current) setElementAudioOutput(audioRef.current, audioOutputDeviceId);
  }, [audioOutputDeviceId]);

  return <audio ref={audioRef} autoPlay className="hidden" />;
}
