import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';
import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface ParticipantVideoProps {
  member: MemberSnapshot;
  audioState: MemberAudioStateStore;
}
