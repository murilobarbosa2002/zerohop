import { ParticipantVideo } from '@/components/ParticipantsView/ParticipantVideo';
import { useMemberAudioState } from '@/hooks/useMemberAudioState';
import type { StageVideoAreaProps } from '@/components/Room/RoomStage/RoomStage.types';

export function StageVideoGrid({ members }: StageVideoAreaProps) {
  const audioState = useMemberAudioState();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
      {members.map((member) => (
        <ParticipantVideo key={member.id} member={member} audioState={audioState} />
      ))}
    </div>
  );
}
