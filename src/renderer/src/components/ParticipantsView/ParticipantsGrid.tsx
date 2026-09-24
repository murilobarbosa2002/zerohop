import { ParticipantTile } from '@/components/ParticipantsView/ParticipantTile';
import type { ParticipantsGridProps } from '@/components/ParticipantsView/ParticipantsGrid.types';

export function ParticipantsGrid({
  members,
  onToggleWatch,
  canKick,
  onKick,
  voiceAudioState,
  contacts,
  onAddContact,
  viewerIds,
  mySharingActive
}: ParticipantsGridProps) {
  return (
    <div className="flex flex-col gap-2">
      {members.map((member) => (
        <ParticipantTile
          key={member.id}
          member={member}
          onToggleWatch={onToggleWatch}
          canKick={canKick}
          onKick={onKick}
          voiceAudioState={voiceAudioState}
          contacts={contacts}
          onAddContact={onAddContact}
          isWatchingMyScreen={mySharingActive ? viewerIds.includes(member.id) : null}
        />
      ))}
    </div>
  );
}
