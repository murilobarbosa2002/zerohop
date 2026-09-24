import type { RoomClient } from '@/services/RoomClient';
import type { SettingsCategory } from '@/constants/settingsCategory';

export interface SettingsScreenProps {
  onBack: () => void;
  roomClient: RoomClient | null;
  findSessionByRoomCode: (roomCode: string) => { roomClient: RoomClient } | null;
  initialCategory?: SettingsCategory;
}
