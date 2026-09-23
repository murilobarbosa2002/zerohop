import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import {
  playCallContactClickSound,
  playRemoveContactClickSound,
  playEditContactOpenSound,
  playEditContactSaveSound,
  playEditContactCancelSound,
  playErrorSound
} from '@/services/soundEffects';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import type { Contact } from '@shared/contact';

interface ContactRowProps {
  contact: Contact;
  onCall: (contact: Contact) => void;
  onEdit: (originalId: string, contact: Contact) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
  online: boolean | undefined;
}

function presenceLabel(online: boolean | undefined): string {
  if (online === undefined) return CONTACTS_STRINGS.checkingPresenceLabel;
  return online ? CONTACTS_STRINGS.onlinePresenceLabel : CONTACTS_STRINGS.offlinePresenceLabel;
}

function presenceDotClassName(online: boolean | undefined): string {
  if (online === undefined) return 'bg-text-dim animate-pulse';
  return online ? 'bg-success' : 'bg-text-dim';
}

export function ContactRow({ contact, onCall, onEdit, onRemove, disabled, online }: ContactRowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(contact.name);
  const [id, setId] = useState(contact.id);
  const [password, setPassword] = useState(contact.password);
  const [error, setError] = useState('');

  function openEdit(): void {
    playEditContactOpenSound();
    setName(contact.name);
    setId(contact.id);
    setPassword(contact.password);
    setError('');
    setEditing(true);
  }

  function cancelEdit(): void {
    playEditContactCancelSound();
    setEditing(false);
  }

  function saveEdit(): void {
    if (!name.trim() || !id.trim() || !password.trim()) {
      setError(CONTACTS_STRINGS.contactFieldsRequiredError);
      playErrorSound();
      return;
    }
    playEditContactSaveSound();
    onEdit(contact.id, { name: name.trim(), id: id.trim(), password: password.trim() });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 mt-2">
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
          {CONTACTS_STRINGS.contactNameFieldLabel}
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={ROOM_NAME_MAX_LENGTH}
            soundKind={TextInputSoundKind.NAME}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-2">
          {CONTACTS_STRINGS.contactIdFieldLabel}
          <TextInput value={id} onChange={(event) => setId(event.target.value)} soundKind={TextInputSoundKind.ROOM_CODE} />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-2">
          {CONTACTS_STRINGS.contactPasswordFieldLabel}
          <PasswordInput
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            maxLength={ROOM_PASSWORD_MAX_LENGTH}
            soundKind={TextInputSoundKind.PASSWORD}
          />
        </label>
        {error && <p className="text-danger text-xs mt-1.5">{error}</p>}
        <div className="flex gap-2 mt-2.5">
          <ActionButton type="button" variant="default" className="flex-1" onClick={cancelEdit}>
            {CONTACTS_STRINGS.editContactCancelButton}
          </ActionButton>
          <ActionButton type="button" variant="primary" className="flex-1" onClick={saveEdit}>
            {CONTACTS_STRINGS.editContactSaveButton}
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-panel-2 border border-border rounded-lg px-3 py-2 mt-2">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${presenceDotClassName(online)}`}
        role="img"
        aria-label={presenceLabel(online)}
        title={presenceLabel(online)}
      />
      <span className="font-bold text-body-sm flex-1 min-w-0 truncate">{contact.name}</span>
      <ActionButton
        type="button"
        variant="primary"
        className="flex-shrink-0"
        disabled={disabled || online === false}
        title={online === false ? CONTACTS_STRINGS.offlinePresenceLabel : undefined}
        onClick={() => {
          playCallContactClickSound();
          onCall(contact);
        }}
      >
        {CONTACTS_STRINGS.callContactButton}
      </ActionButton>
      <ActionButton type="button" variant="default" className="flex-shrink-0" disabled={disabled} onClick={openEdit}>
        {CONTACTS_STRINGS.editContactButton}
      </ActionButton>
      <ActionButton
        type="button"
        variant="danger"
        className="flex-shrink-0"
        disabled={disabled}
        onClick={() => {
          playRemoveContactClickSound();
          onRemove(contact.id);
        }}
      >
        {CONTACTS_STRINGS.removeContactButton}
      </ActionButton>
    </div>
  );
}
