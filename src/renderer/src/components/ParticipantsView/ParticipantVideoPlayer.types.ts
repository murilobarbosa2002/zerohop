import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';
import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface MemberWithActiveStream extends MemberSnapshot {
  stream: MediaStream;
}

export interface ParticipantVideoPlayerProps {
  member: MemberWithActiveStream;
  audioState: MemberAudioStateStore;
}
