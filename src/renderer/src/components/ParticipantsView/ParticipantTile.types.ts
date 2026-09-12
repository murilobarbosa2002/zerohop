import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface ParticipantTileProps {
  member: MemberSnapshot;
  onToggleWatch: (id: string) => void;
  canKick: boolean;
  onKick: (id: string) => void;
}
