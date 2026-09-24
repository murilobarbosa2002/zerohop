import type { RoomClient } from '@/services/RoomClient';
import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';

export interface RoomVoiceSinkProps {
  roomClient: RoomClient;
  voiceAudioState: MemberAudioStateStore;
}
