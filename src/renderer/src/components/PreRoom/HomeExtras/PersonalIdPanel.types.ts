import type { RoomClient } from '@/services/RoomClient';

export interface PersonalIdPanelProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  onOpenPersonalRoomSettings: () => void;
  onOpenProfile: () => void;
}
