import type { RoomClient } from '@/services/RoomClient';

export interface PersonalRoomSettingsProps {
  findSessionByRoomCode: (roomCode: string) => { roomClient: RoomClient } | null;
}
