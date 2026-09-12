import { useSyncExternalStore } from 'react';
import {
  getExperimentalPerAppAudioEnabled,
  setExperimentalPerAppAudioEnabled,
  subscribeToExperimentalPerAppAudio
} from '@/services/experimentalPerAppAudioPreference';

export function useExperimentalPerAppAudio(): [boolean, (enabled: boolean) => void] {
  const enabled = useSyncExternalStore(subscribeToExperimentalPerAppAudio, getExperimentalPerAppAudioEnabled);
  return [enabled, setExperimentalPerAppAudioEnabled];
}
