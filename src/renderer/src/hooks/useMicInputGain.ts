import { useSyncExternalStore } from 'react';
import { getMicInputGain, setMicInputGain, subscribeToMicInputGain } from '@/services/micInputPreference';

export function useMicInputGain(): [number, (gain: number) => void] {
  const gain = useSyncExternalStore(subscribeToMicInputGain, getMicInputGain);
  return [gain, setMicInputGain];
}
