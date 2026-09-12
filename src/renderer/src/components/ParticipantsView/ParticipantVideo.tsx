import { ParticipantVideoConnecting } from '@/components/ParticipantsView/ParticipantVideoConnecting';
import { ParticipantVideoPlayer } from '@/components/ParticipantsView/ParticipantVideoPlayer';
import type { ParticipantVideoProps } from '@/components/ParticipantsView/ParticipantVideo.types';

export function ParticipantVideo({ member, audioState }: ParticipantVideoProps) {
  return !member.stream ? (
    <ParticipantVideoConnecting />
  ) : (
    <ParticipantVideoPlayer member={{ ...member, stream: member.stream }} audioState={audioState} />
  );
}
