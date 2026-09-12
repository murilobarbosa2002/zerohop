import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface ParticipantsViewProps {
  members: MemberSnapshot[];
  onToggleWatch: (id: string) => void;
  canKick: boolean;
  onKick: (id: string) => void;
}
