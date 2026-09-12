import { ParticipantTile } from '@/components/ParticipantsView/ParticipantTile';
import { useMemberAudioState } from '@/hooks/useMemberAudioState';
import type { ParticipantsGridProps } from '@/components/ParticipantsView/ParticipantsGrid.types';

export function ParticipantsGrid({ members, onToggleWatch, canKick, onKick }: ParticipantsGridProps) {
  const audioState = useMemberAudioState();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
      {members.map((member) => (
        <ParticipantTile
          key={member.id}
          member={member}
          onToggleWatch={onToggleWatch}
          audioState={audioState}
          canKick={canKick}
          onKick={onKick}
        />
      ))}
    </div>
  );
}
