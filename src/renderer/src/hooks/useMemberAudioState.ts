import { useRef } from 'react';
import { DEFAULT_VOLUME } from '@/constants/volume';
import type { MemberAudioState, MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';

export function createMemberAudioStateStore(): MemberAudioStateStore {
  const state = new Map<string, MemberAudioState>();
  const emitter = new EventTarget();

  function get(id: string): MemberAudioState {
    let entry = state.get(id);
    if (!entry) {
      entry = { volume: DEFAULT_VOLUME, muted: false };
      state.set(id, entry);
    }
    return entry;
  }

  function notifyChange(id: string): void {
    emitter.dispatchEvent(new CustomEvent('change', { detail: { id } }));
  }

  function subscribe(id: string, listener: () => void): () => void {
    const handler = (event: Event): void => {
      if ((event as CustomEvent<{ id: string }>).detail.id === id) listener();
    };
    emitter.addEventListener('change', handler);
    return () => emitter.removeEventListener('change', handler);
  }

  return { get, notifyChange, subscribe };
}

export function useMemberAudioState(): MemberAudioStateStore {
  return useRef(createMemberAudioStateStore()).current;
}
