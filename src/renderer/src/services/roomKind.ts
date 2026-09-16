import { getPersonalId } from '@/services/personalRoomPreference';

export type RoomKind = 'personal' | 'normal';

export function getRoomKind(roomCode: string | null): RoomKind {
  if (roomCode === getPersonalId()) return 'personal';
  return 'normal';
}
