import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface RoomSidebarProps {
  roomCode: string;
  roomPassword: string;
  members: MemberSnapshot[];
  canKick: boolean;
  onToggleWatch: (id: string) => void;
  onKick: (id: string) => void;
  onLeave: () => void;
}
