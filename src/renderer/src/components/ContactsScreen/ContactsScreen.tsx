import { useState } from 'react';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { AvatarPicker } from '@/components/AvatarPicker';
import { ContactRow } from '@/components/ContactsScreen/ContactRow';
import { AddContactForm } from '@/components/ContactsScreen/AddContactForm';
import { useAvatarId } from '@/hooks/useAvatarId';
import { useNamePreference } from '@/hooks/useNamePreference';
import { useContacts } from '@/hooks/useContacts';
import { useContactsPresence } from '@/hooks/useContactsPresence';
import { recordRecentContact } from '@/services/recentContactPreference';
import { errorMessage } from '@/lib/errorMessage';
import { playBackButtonSound, playErrorSound } from '@/services/soundEffects';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import type { Contact } from '@shared/contact';
import type { ContactsScreenProps } from '@/components/ContactsScreen/ContactsScreen.types';

export function ContactsScreen({ roomClient, onEntered, onBack }: ContactsScreenProps) {
  const [name, setName] = useNamePreference();
  const [avatarId, setAvatarId] = useAvatarId();
  const { contacts, addContact, updateContact, removeContact } = useContacts();
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const onlineStatus = useContactsPresence(contacts);

  function requireName(): boolean {
    if (name.trim()) return true;
    setStatus(PRE_ROOM_STRINGS.nameRequiredError);
    playErrorSound();
    return false;
  }

  async function handleCallContact(contact: Contact): Promise<void> {
    if (!requireName()) return;
    setBusy(true);
    setStatus(CONTACTS_STRINGS.callingContactStatus);
    try {
      const code = await roomClient.joinRoom(name, contact.id, contact.password, avatarId);
      recordRecentContact(contact.id);
      onEntered(code);
    } catch (error) {
      setStatus(CONTACTS_STRINGS.callContactError(errorMessage(error)));
      playErrorSound();
      setBusy(false);
    }
  }

  return (
    <div className="max-w-contacts-screen mx-auto">
      <Card>
        <Header />
        <div className="flex items-center gap-3 mb-4">
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

        <div className="flex items-end gap-4 flex-wrap mb-4">
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

        <Card muted>
          <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.contactsListTitle}</p>
          {contacts.length === 0 ? (
            <p className="text-text-dim text-xs mt-2">{CONTACTS_STRINGS.noContactsMessage}</p>
          ) : (
            contacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onCall={handleCallContact}
                onEdit={updateContact}
                onRemove={removeContact}
                disabled={busy}
                online={onlineStatus.get(contact.id)}
              />
            ))
          )}
          {status && <p className="text-text-dim text-xs mt-2">{status}</p>}
        </Card>

        <div className="mt-4">
          <AddContactForm onAdd={addContact} />
        </div>
      </Card>
    </div>
  );
}
