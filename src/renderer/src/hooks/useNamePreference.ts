import { useSyncExternalStore } from 'react';
import { getName, setName, subscribeToName } from '@/services/namePreference';

export function useNamePreference(): [string, (name: string) => void] {
  const name = useSyncExternalStore(subscribeToName, getName);
  return [name, setName];
}
