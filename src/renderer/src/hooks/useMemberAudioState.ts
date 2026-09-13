import { useRef } from 'react';
import { DEFAULT_VOLUME } from '@/constants/volume';
import type { MemberAudioState, MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';

export function useMemberAudioState(): MemberAudioStateStore {
  const stateRef = useRef(new Map<string, MemberAudioState>());
  const emitterRef = useRef(new EventTarget());

  function get(id: string): MemberAudioState {
    let state = stateRef.current.get(id);
    if (!state) {
      state = { volume: DEFAULT_VOLUME, muted: false };
      stateRef.current.set(id, state);
    }
    return state;
  }

  function notifyChange(id: string): void {
    emitterRef.current.dispatchEvent(new CustomEvent('change', { detail: { id } }));
  }

  function subscribe(id: string, listener: () => void): () => void {
    const handler = (event: Event): void => {
      if ((event as CustomEvent<{ id: string }>).detail.id === id) listener();
    };
    emitterRef.current.addEventListener('change', handler);
    return () => emitterRef.current.removeEventListener('change', handler);
  }

  return { get, notifyChange, subscribe };
}
