import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface ParticipantsGridProps {
  members: MemberSnapshot[];
  onToggleWatch: (id: string) => void;
  canKick: boolean;
  onKick: (id: string) => void;
}
