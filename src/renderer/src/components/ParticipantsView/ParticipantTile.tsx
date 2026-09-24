import { useReducer, useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { VolumeControl } from '@/components/ParticipantsView/VolumeControl';
import { Avatar } from '@/components/Avatar';
import { PasswordInput } from '@/components/PasswordInput';
import { MicIcon, EyeIcon } from '@/components/icons';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import {
  playAddContactToRoomOpenSound,
  playAddContactToRoomCancelSound,
  playAddContactClickSound,
  playErrorSound
} from '@/services/soundEffects';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import { resolveContactDisplayName } from '@/lib/resolveContactDisplayName';
import type { ParticipantTileProps } from '@/components/ParticipantsView/ParticipantTile.types';

export function ParticipantTile({
  member,
  onToggleWatch,
  canKick,
  onKick,
  voiceAudioState,
  contacts,
  onAddContact,
  isWatchingMyScreen
}: ParticipantTileProps) {
  const displayName = resolveContactDisplayName(member.name, member.personalId, contacts);
  const avatarInitial = (displayName || '?').charAt(0).toUpperCase();
  const [, forceRender] = useReducer((renderCount: number) => renderCount + 1, 0);
  const voiceState = voiceAudioState.get(member.id);
  const [addingContact, setAddingContact] = useState(false);
  const [contactPassword, setContactPassword] = useState('');
  const [contactError, setContactError] = useState('');

  const isAlreadyContact = member.personalId !== null && contacts.some((contact) => contact.id === member.personalId);

  function handleConfirmAddContact(): void {
    if (!contactPassword.trim() || !member.personalId) {
      setContactError(PARTICIPANTS_STRINGS.addToContactsFieldRequiredError);
      playErrorSound();
      return;
    }
    playAddContactClickSound();
    onAddContact({ id: member.personalId, name: member.name, password: contactPassword.trim() });
    setAddingContact(false);
    setContactPassword('');
    setContactError('');
  }

  function handleCancelAddContact(): void {
    playAddContactToRoomCancelSound();
    setAddingContact(false);
    setContactPassword('');
    setContactError('');
  }

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
        <span className="min-w-0 flex-1">
          <span className="font-bold text-body-sm-alt truncate block">{displayName || member.id}</span>
          {member.status && <span className="text-text-dim text-body-xs truncate block">{member.status}</span>}
        </span>
        {isWatchingMyScreen !== null && (
          <span
            className={isWatchingMyScreen ? 'text-success flex-shrink-0' : 'text-text-dim flex-shrink-0'}
            aria-label={isWatchingMyScreen ? PARTICIPANTS_STRINGS.watchingMyScreenBadge : PARTICIPANTS_STRINGS.notWatchingMyScreenBadge}
            title={isWatchingMyScreen ? PARTICIPANTS_STRINGS.watchingMyScreenBadge : PARTICIPANTS_STRINGS.notWatchingMyScreenBadge}
          >
            <EyeIcon crossed={!isWatchingMyScreen} />
          </span>
        )}
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
              size="compact"
              className="flex-1 mr-0 my-0"
              onClick={() => onToggleWatch(member.id)}
            >
              {member.watching ? PARTICIPANTS_STRINGS.stopWatchingButton : PARTICIPANTS_STRINGS.watchButton}
            </ActionButton>
          )}
          {canKick && (
            <button
              onClick={() => onKick(member.id)}
              className="flex-1 text-body-xs font-bold text-danger bg-danger/15 rounded-lg px-2 py-1.5 hover:brightness-110"
            >
              {PARTICIPANTS_STRINGS.kickMemberButton}
            </button>
          )}
        </div>
      )}

      {member.personalId !== null && isAlreadyContact && (
        <p className="text-text-dim text-body-xs font-bold mt-2">{PARTICIPANTS_STRINGS.alreadyContactBadge}</p>
      )}

      {member.personalId !== null && !isAlreadyContact && !addingContact && (
        <ActionButton
          variant="default"
          size="compact"
          className="w-full mt-2"
          onClick={() => {
            playAddContactToRoomOpenSound();
            setAddingContact(true);
          }}
        >
          {PARTICIPANTS_STRINGS.addToContactsButton}
        </ActionButton>
      )}

      {addingContact && (
        <div className="mt-2 bg-panel border border-border rounded-lg px-2.5 py-2">
          <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
            {PARTICIPANTS_STRINGS.addToContactsPasswordLabel}
            <PasswordInput
              value={contactPassword}
              onChange={(event) => setContactPassword(event.target.value)}
              maxLength={ROOM_PASSWORD_MAX_LENGTH}
              placeholder={PARTICIPANTS_STRINGS.addToContactsPasswordPlaceholder}
              soundKind={TextInputSoundKind.PASSWORD}
            />
          </label>
          {contactError && <p className="text-danger text-xs mt-1.5">{contactError}</p>}
          <div className="flex gap-1.5 mt-2">
            <ActionButton variant="default" size="compact" className="flex-1" onClick={handleCancelAddContact}>
              {PARTICIPANTS_STRINGS.addToContactsCancelButton}
            </ActionButton>
            <ActionButton variant="primary" size="compact" className="flex-1" onClick={handleConfirmAddContact}>
              {PARTICIPANTS_STRINGS.addToContactsConfirmButton}
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}
