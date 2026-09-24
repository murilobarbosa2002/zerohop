import type { RoomClient } from '@/services/RoomClient';

export interface ContactsScreenProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  onBack: () => void;
  onOpenProfile: () => void;
}
