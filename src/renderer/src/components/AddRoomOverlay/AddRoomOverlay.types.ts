import type { RoomClient } from '@/services/RoomClient';
import type { PreRoomScreen } from '@/constants/preRoomScreen';

export interface AddRoomOverlayProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  initialScreen?: PreRoomScreen;
  onOpenUpdates: () => void;
  onOpenPersonalRoomSettings: () => void;
}
