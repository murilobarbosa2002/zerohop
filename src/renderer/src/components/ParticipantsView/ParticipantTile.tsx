import { useReducer } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { VolumeControl } from '@/components/ParticipantsView/VolumeControl';
import { Avatar } from '@/components/Avatar';
import { MicIcon } from '@/components/icons';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import type { ParticipantTileProps } from '@/components/ParticipantsView/ParticipantTile.types';

export function ParticipantTile({ member, onToggleWatch, canKick, onKick, voiceAudioState }: ParticipantTileProps) {
  const avatarInitial = (member.name || '?').charAt(0).toUpperCase();
  const [, forceRender] = useReducer((renderCount: number) => renderCount + 1, 0);
  const voiceState = voiceAudioState.get(member.id);

  function toggleVoiceMute(): void {
    voiceState.muted = !voiceState.muted;
    forceRender();
    voiceAudioState.notifyChange(member.id);
  }

  function changeVoiceVolume(volume: number): void {
    voiceState.volume = volume;
    forceRender();
    voiceAudioState.notifyChange(member.id);
  }

  return (
    <div className="bg-panel-2 border border-border rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="relative flex-shrink-0">
          <Avatar avatarId={member.avatarId} fallbackLetter={avatarInitial} size={26} />
          {member.sharing && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-success border-2 border-panel-2"
              role="img"
              aria-label={PARTICIPANTS_STRINGS.sharingBadge}
              title={PARTICIPANTS_STRINGS.sharingBadge}
            />
          )}
        </span>
        <span className="font-bold text-body-sm-alt truncate flex-1 min-w-0">{member.name || member.id}</span>
        {member.micMuted && (
          <span
            className="text-danger flex-shrink-0"
            aria-label={PARTICIPANTS_STRINGS.micMutedBadge}
            title={PARTICIPANTS_STRINGS.micMutedBadge}
          >
            <MicIcon muted />
          </span>
        )}
      </div>

      {member.voiceStream && (
        <VolumeControl
          muted={voiceState.muted}
          volume={voiceState.volume}
          onToggleMute={toggleVoiceMute}
          onChangeVolume={changeVoiceVolume}
        />
      )}

      {(member.sharing || canKick) && (
        <div className="flex flex-row gap-1.5 mt-2">
          {member.sharing && (
            <ActionButton
              variant={member.watching ? 'default' : 'primary'}
              className="flex-1 mr-0 my-0 text-badge-xs"
              onClick={() => onToggleWatch(member.id)}
            >
              {member.watching ? PARTICIPANTS_STRINGS.stopWatchingButton : PARTICIPANTS_STRINGS.watchButton}
            </ActionButton>
          )}
          {canKick && (
            <button
              onClick={() => onKick(member.id)}
              className="flex-1 text-badge-xs font-bold text-danger bg-danger/15 rounded-lg px-2 py-1.5 hover:brightness-110"
            >
              {PARTICIPANTS_STRINGS.kickMemberButton}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
