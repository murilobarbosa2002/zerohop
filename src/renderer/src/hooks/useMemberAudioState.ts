import { useRef } from 'react';
import { DEFAULT_VOLUME } from '@/constants/volume';
import type { MemberAudioState, MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';

export function useMemberAudioState(): MemberAudioStateStore {
  const stateRef = useRef(new Map<string, MemberAudioState>());

  function get(id: string): MemberAudioState {
    let state = stateRef.current.get(id);
    if (!state) {
      state = { volume: DEFAULT_VOLUME, muted: false };
      stateRef.current.set(id, state);
    }
    return state;
  }

  return { get };
}
