import { useState } from 'react';
import {
  getAutoRoomId,
  getAutoRoomPassword,
  setAutoRoomPassword,
  getAutoInviteContactIds,
  setAutoInviteContactIds
} from '@/services/autoRoomPreference';

export interface UseAutoRoomResult {
  id: string;
  password: string;
  setPassword: (value: string) => void;
  inviteContactIds: string[];
  setInviteContactIds: (ids: string[]) => void;
}

export function useAutoRoom(): UseAutoRoomResult {
  const [id] = useState(getAutoRoomId);
  const [password, setPasswordState] = useState(getAutoRoomPassword);
  const [inviteContactIds, setInviteContactIdsState] = useState(getAutoInviteContactIds);

  function setPassword(value: string): void {
    setPasswordState(value);
    setAutoRoomPassword(value);
  }

  function setInviteContactIds(ids: string[]): void {
    setInviteContactIdsState(ids);
    setAutoInviteContactIds(ids);
  }

  return { id, password, setPassword, inviteContactIds, setInviteContactIds };
}
