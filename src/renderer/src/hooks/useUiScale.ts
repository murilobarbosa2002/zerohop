import { useSyncExternalStore } from 'react';
import { getUiScale, setUiScale, subscribeToUiScale } from '@/services/uiScalePreference';

export function useUiScale(): [number, (scale: number) => void] {
  const scale = useSyncExternalStore(subscribeToUiScale, getUiScale);
  return [scale, setUiScale];
}
