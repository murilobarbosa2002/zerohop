import type { MemberSnapshot } from '@/services/room/MemberRegistry';
import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';

export interface VoiceAudioSinksProps {
  members: MemberSnapshot[];
  voiceAudioState: MemberAudioStateStore;
  deafened: boolean;
}

export interface VoiceAudioSinkProps {
  member: MemberSnapshot;
  voiceAudioState: MemberAudioStateStore;
  deafened: boolean;
}
