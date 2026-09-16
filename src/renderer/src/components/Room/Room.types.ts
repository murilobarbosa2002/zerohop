import type { RoomClient } from '@/services/RoomClient';

export interface RoomProps {
  roomClient: RoomClient;
  roomCode: string;
  onLeft: () => void;
}
