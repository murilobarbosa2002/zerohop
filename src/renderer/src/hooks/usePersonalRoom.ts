import { useState } from 'react';
import { getPersonalId, getPersonalPassword, setPersonalPassword } from '@/services/personalRoomPreference';

export function usePersonalRoom(): { id: string; password: string; setPassword: (value: string) => void } {
  const [id] = useState(getPersonalId);
  const [password, setPasswordState] = useState(getPersonalPassword);

  function setPassword(value: string): void {
    setPasswordState(value);
    setPersonalPassword(value);
  }

  return { id, password, setPassword };
}
