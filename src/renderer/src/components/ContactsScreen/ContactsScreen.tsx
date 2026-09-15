import { useState } from 'react';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { AvatarPicker } from '@/components/AvatarPicker';
import { PersonalRoomCard } from '@/components/ContactsScreen/PersonalRoomCard';
import { ContactRow } from '@/components/ContactsScreen/ContactRow';
import { AddContactForm } from '@/components/ContactsScreen/AddContactForm';
import { useAvatarId } from '@/hooks/useAvatarId';
import { useContacts } from '@/hooks/useContacts';
import { usePersonalRoom } from '@/hooks/usePersonalRoom';
import { errorMessage } from '@/lib/errorMessage';
import { playBackButtonSound, playErrorSound } from '@/services/soundEffects';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MIN_LENGTH } from '@/constants/roomPassword';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import type { Contact } from '@shared/contact';
import type { ContactsScreenProps } from '@/components/ContactsScreen/ContactsScreen.types';

export function ContactsScreen({ roomClient, onEntered, onBack }: ContactsScreenProps) {
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useAvatarId();
  const { contacts, addContact, removeContact } = useContacts();
  const personalRoom = usePersonalRoom();
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  function requireName(): boolean {
    if (name.trim()) return true;
    setStatus(PRE_ROOM_STRINGS.nameRequiredError);
    playErrorSound();
    return false;
  }

  async function handleOpenPersonalRoom(): Promise<void> {
    if (!requireName()) return;
    if (personalRoom.password.trim().length < ROOM_PASSWORD_MIN_LENGTH) {
      setStatus(CONTACTS_STRINGS.personalPasswordTooShortError);
      playErrorSound();
      return;
    }
    setBusy(true);
    setStatus(CONTACTS_STRINGS.openingPersonalRoomStatus);
    try {
      const code = await roomClient.createRoom(name, personalRoom.password, avatarId, personalRoom.id);
      onEntered(code);
    } catch (error) {
      setStatus(CONTACTS_STRINGS.callContactError(errorMessage(error)));
      playErrorSound();
      setBusy(false);
    }
  }

  async function handleCallContact(contact: Contact): Promise<void> {
    if (!requireName()) return;
    setBusy(true);
    setStatus(CONTACTS_STRINGS.callingContactStatus);
    try {
      const code = await roomClient.joinRoom(name, contact.id, contact.password, avatarId);
      onEntered(code);
    } catch (error) {
      setStatus(CONTACTS_STRINGS.callContactError(errorMessage(error)));
      playErrorSound();
      setBusy(false);
    }
  }

  return (
    <div className="max-w-contacts-screen mx-auto flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ActionButton
          type="button"
          variant="default"
          onClick={() => {
            playBackButtonSound();
            onBack();
          }}
        >
          {CONTACTS_STRINGS.backButton}
        </ActionButton>
        <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.screenTitle}</p>
      </div>

      <Card>
        <div className="flex items-end gap-4 flex-wrap">
          <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold flex-1 min-w-form-column">
            {PRE_ROOM_STRINGS.nameFieldLabel}
            <TextInput
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={ROOM_NAME_MAX_LENGTH}
              placeholder={PRE_ROOM_STRINGS.nameFieldPlaceholder}
              soundKind={TextInputSoundKind.NAME}
            />
          </label>
          <AvatarPicker value={avatarId} onChange={setAvatarId} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <PersonalRoomCard
          id={personalRoom.id}
          password={personalRoom.password}
          onChangePassword={personalRoom.setPassword}
          onOpen={handleOpenPersonalRoom}
          status={status}
        />

        <div className="flex flex-col gap-4">
          <Card>
            <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.contactsListTitle}</p>
            {contacts.length === 0 ? (
              <p className="text-text-dim text-xs mt-2">{CONTACTS_STRINGS.noContactsMessage}</p>
            ) : (
              contacts.map((contact) => (
                <ContactRow key={contact.id} contact={contact} onCall={handleCallContact} onRemove={removeContact} disabled={busy} />
              ))
            )}
          </Card>

          <AddContactForm onAdd={addContact} />
        </div>
      </div>
    </div>
  );
}
