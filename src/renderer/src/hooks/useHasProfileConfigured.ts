import { useSyncExternalStore } from 'react';
import { hasProfileConfigured, subscribeToName } from '@/services/namePreference';

export function useHasProfileConfigured(): boolean {
  return useSyncExternalStore(subscribeToName, hasProfileConfigured);
}
