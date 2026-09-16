import { getPersonalId } from '@/services/personalRoomPreference';
import { getAutoRoomId } from '@/services/autoRoomPreference';

export type RoomKind = 'personal' | 'auto' | 'normal';

export function getRoomKind(roomCode: string | null): RoomKind {
  if (roomCode === getPersonalId()) return 'personal';
  if (roomCode === getAutoRoomId()) return 'auto';
  return 'normal';
}
