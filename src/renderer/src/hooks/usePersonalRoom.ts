import { useState } from 'react';
import {
  getPersonalId,
  getPersonalPassword,
  setPersonalPassword,
  getPersonalAutoOpenEnabled,
  setPersonalAutoOpenEnabled
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
  const [password, setPasswordState] = useState(getPersonalPassword);
  const [autoOpenEnabled, setAutoOpenEnabledState] = useState(getPersonalAutoOpenEnabled);

  function setPassword(value: string): void {
    setPasswordState(value);
    setPersonalPassword(value);
  }

  function setAutoOpenEnabled(value: boolean): void {
    setAutoOpenEnabledState(value);
    setPersonalAutoOpenEnabled(value);
  }

  return { id, password, setPassword, autoOpenEnabled, setAutoOpenEnabled };
}
