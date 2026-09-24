import type { RoomClient } from '@/services/RoomClient';

export interface HomeExtrasProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  onOpenUpdates: () => void;
  onOpenPersonalRoomSettings: () => void;
  onOpenProfile: () => void;
}
