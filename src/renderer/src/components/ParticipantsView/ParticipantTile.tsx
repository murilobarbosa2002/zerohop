import { ActionButton } from '@/components/ActionButton';
import { ParticipantVideo } from '@/components/ParticipantsView/ParticipantVideo';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import type { ParticipantTileProps } from '@/components/ParticipantsView/ParticipantTile.types';

export function ParticipantTile({ member, onToggleWatch, audioState, canKick, onKick }: ParticipantTileProps) {
  const avatarInitial = (member.name || '?').charAt(0).toUpperCase();

  return (
    <div className="bg-panel-2 border border-border rounded-xl p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="font-bold text-body-sm-alt flex items-center gap-2">
          <span className="w-avatar-size h-avatar-size rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-body-xs font-bold text-white flex-shrink-0">
            {avatarInitial}
          </span>
          {member.name || member.id}
        </div>
        <div className="flex items-center gap-2">
          {member.sharing && (
            <span className="text-badge-xs font-bold text-success bg-success/15 rounded-full px-2 py-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              {PARTICIPANTS_STRINGS.sharingBadge}
            </span>
          )}
          {canKick && (
            <button
              onClick={() => onKick(member.id)}
              className="text-badge-xs font-bold text-danger bg-danger/15 rounded-full px-2 py-0.5 hover:brightness-110"
            >
              {PARTICIPANTS_STRINGS.kickMemberButton}
            </button>
          )}
        </div>
      </div>

      {!member.sharing ? (
        <p className="text-text-dim text-xs py-2.5">{PARTICIPANTS_STRINGS.notSharingMessage}</p>
      ) : (
        <>
          <ActionButton variant={member.watching ? 'default' : 'primary'} onClick={() => onToggleWatch(member.id)}>
            {member.watching ? PARTICIPANTS_STRINGS.stopWatchingButton : PARTICIPANTS_STRINGS.watchButton}
          </ActionButton>
          {member.watching && <ParticipantVideo member={member} audioState={audioState} />}
        </>
      )}
    </div>
  );
}
