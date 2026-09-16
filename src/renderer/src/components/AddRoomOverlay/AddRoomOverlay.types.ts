import type { RoomClient } from '@/services/RoomClient';

export interface AddRoomOverlayProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  onCancel: () => void;
  findSessionByRoomCode: (roomCode: string) => { roomClient: RoomClient } | null;
}
