import type { RoomClient } from '@/services/RoomClient';
import type { PreRoomScreen } from '@/constants/preRoomScreen';

export interface AddRoomOverlayProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  onCancel: () => void;
  findSessionByRoomCode: (roomCode: string) => { roomClient: RoomClient } | null;
  initialScreen?: PreRoomScreen;
}
