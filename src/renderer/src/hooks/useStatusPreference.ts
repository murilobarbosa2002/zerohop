import { useSyncExternalStore } from 'react';
import { getStatus, setStatus, subscribeToStatus } from '@/services/statusPreference';

export function useStatusPreference(): [string, (status: string) => void] {
  const status = useSyncExternalStore(subscribeToStatus, getStatus);
  return [status, setStatus];
}
