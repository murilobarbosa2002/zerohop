import { useSyncExternalStore } from 'react';
import { getSoundEffectsVolume, setSoundEffectsVolume, subscribeToSoundEffectsVolume } from '@/services/soundEffectsPreference';

export function useSoundEffectsVolume(): [number, (volume: number) => void] {
  const volume = useSyncExternalStore(subscribeToSoundEffectsVolume, getSoundEffectsVolume);
  return [volume, setSoundEffectsVolume];
}
