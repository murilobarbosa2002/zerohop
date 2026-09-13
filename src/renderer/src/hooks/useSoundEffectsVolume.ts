import { useSyncExternalStore, useCallback } from 'react';
import { getSoundEffectsVolume, setSoundEffectsVolume, subscribeToSoundEffectsVolume } from '@/services/soundEffectsPreference';
import type { SoundCategory } from '@/constants/soundEffects';

export function useSoundEffectsVolume(category: SoundCategory): [number, (volume: number) => void] {
  const getSnapshot = useCallback(() => getSoundEffectsVolume(category), [category]);
  const volume = useSyncExternalStore(subscribeToSoundEffectsVolume, getSnapshot);
  const setVolume = useCallback((next: number) => setSoundEffectsVolume(category, next), [category]);
  return [volume, setVolume];
}
