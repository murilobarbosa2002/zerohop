import type { RoomClient } from '@/services/RoomClient';

export interface PreRoomProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
}
