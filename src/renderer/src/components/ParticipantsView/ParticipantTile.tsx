import { ActionButton } from '@/components/ActionButton';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import type { ParticipantTileProps } from '@/components/ParticipantsView/ParticipantTile.types';

export function ParticipantTile({ member, onToggleWatch, canKick, onKick }: ParticipantTileProps) {
  const avatarInitial = (member.name || '?').charAt(0).toUpperCase();

  return (
    <div className="bg-panel-2 border border-border rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-avatar-size h-avatar-size rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-body-xs font-bold text-white flex-shrink-0">
          {avatarInitial}
        </span>
        <span className="font-bold text-body-sm-alt truncate flex-1 min-w-0">{member.name || member.id}</span>
        {member.sharing && <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" title={PARTICIPANTS_STRINGS.sharingBadge} />}
      </div>

      <div className="flex items-center gap-2 mt-2">
        {member.sharing && (
          <ActionButton
            variant={member.watching ? 'default' : 'primary'}
            className="flex-1"
            onClick={() => onToggleWatch(member.id)}
          >
            {member.watching ? PARTICIPANTS_STRINGS.stopWatchingButton : PARTICIPANTS_STRINGS.watchButton}
          </ActionButton>
        )}
        {canKick && (
          <button
            onClick={() => onKick(member.id)}
            className="text-badge-xs font-bold text-danger bg-danger/15 rounded-full px-2 py-1 hover:brightness-110 flex-shrink-0"
          >
            {PARTICIPANTS_STRINGS.kickMemberButton}
          </button>
        )}
      </div>
    </div>
  );
}
