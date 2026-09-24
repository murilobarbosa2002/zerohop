import { useState, useSyncExternalStore } from 'react';
import {
  getPersonalId,
  getPersonalPassword,
  setPersonalPassword,
  subscribeToPersonalPassword,
  getPersonalAutoOpenEnabled,
  setPersonalAutoOpenEnabled,
  subscribeToPersonalAutoOpenEnabled
} from '@/services/personalRoomPreference';

export interface UsePersonalRoomResult {
  id: string;
  password: string;
  setPassword: (value: string) => void;
  autoOpenEnabled: boolean;
  setAutoOpenEnabled: (value: boolean) => void;
}

export function usePersonalRoom(): UsePersonalRoomResult {
  const [id] = useState(getPersonalId);
  const password = useSyncExternalStore(subscribeToPersonalPassword, getPersonalPassword);
  const autoOpenEnabled = useSyncExternalStore(subscribeToPersonalAutoOpenEnabled, getPersonalAutoOpenEnabled);

  return { id, password, setPassword: setPersonalPassword, autoOpenEnabled, setAutoOpenEnabled: setPersonalAutoOpenEnabled };
}
