import { ParticipantTile } from '@/components/ParticipantsView/ParticipantTile';
import type { ParticipantsGridProps } from '@/components/ParticipantsView/ParticipantsGrid.types';

export function ParticipantsGrid({ members, onToggleWatch, canKick, onKick }: ParticipantsGridProps) {
  return (
    <div className="flex flex-col gap-2">
      {members.map((member) => (
        <ParticipantTile key={member.id} member={member} onToggleWatch={onToggleWatch} canKick={canKick} onKick={onKick} />
      ))}
    </div>
  );
}
