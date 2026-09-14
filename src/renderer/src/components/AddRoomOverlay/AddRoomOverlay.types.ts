import type { RoomClient } from '@/services/RoomClient';

export interface AddRoomOverlayProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  onCancel: () => void;
}
