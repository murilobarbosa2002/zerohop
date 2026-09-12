import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';
import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface ParticipantTileProps {
  member: MemberSnapshot;
  onToggleWatch: (id: string) => void;
  audioState: MemberAudioStateStore;
  canKick: boolean;
  onKick: (id: string) => void;
}
