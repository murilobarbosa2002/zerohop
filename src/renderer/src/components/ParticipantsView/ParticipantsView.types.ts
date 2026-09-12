import type { MemberSnapshot } from '@/services/room/MemberRegistry';
import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';

export interface ParticipantsViewProps {
  members: MemberSnapshot[];
  onToggleWatch: (id: string) => void;
  canKick: boolean;
  onKick: (id: string) => void;
  voiceAudioState: MemberAudioStateStore;
  deafened: boolean;
}
