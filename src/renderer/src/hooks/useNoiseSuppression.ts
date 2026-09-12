import { useSyncExternalStore } from 'react';
import { getNoiseSuppressionEnabled, setNoiseSuppressionEnabled, subscribeToNoiseSuppression } from '@/services/micInputPreference';

export function useNoiseSuppression(): [boolean, (enabled: boolean) => void] {
  const enabled = useSyncExternalStore(subscribeToNoiseSuppression, getNoiseSuppressionEnabled);
  return [enabled, setNoiseSuppressionEnabled];
}
