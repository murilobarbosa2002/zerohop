import { useState } from 'react';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { ContactRow } from '@/components/ContactsScreen/ContactRow';
import { AddContactForm } from '@/components/ContactsScreen/AddContactForm';
import { ProfileRequiredNotice } from '@/components/ProfileRequiredNotice';
import { useAvatarId } from '@/hooks/useAvatarId';
import { useNamePreference } from '@/hooks/useNamePreference';
import { useHasProfileConfigured } from '@/hooks/useHasProfileConfigured';
import { useContacts } from '@/hooks/useContacts';
import { useContactsPresence } from '@/hooks/useContactsPresence';
import { recordRecentContact } from '@/services/recentContactPreference';
import { errorMessage } from '@/lib/errorMessage';
import { playBackButtonSound, playErrorSound } from '@/services/soundEffects';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import type { Contact } from '@shared/contact';
import type { ContactsScreenProps } from '@/components/ContactsScreen/ContactsScreen.types';

export function ContactsScreen({ roomClient, onEntered, onBack, onOpenProfile }: ContactsScreenProps) {
  const [name] = useNamePreference();
  const [avatarId] = useAvatarId();
  const hasProfileConfigured = useHasProfileConfigured();
  const { contacts, addContact, updateContact, removeContact } = useContacts();
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const onlineStatus = useContactsPresence(contacts);

  const visibleContacts = contacts
    .filter((contact) => contact.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    .sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)));

  function handleToggleFavorite(contact: Contact): void {
    updateContact(contact.id, { ...contact, favorite: !contact.favorite });
  }

  async function handleCallContact(contact: Contact): Promise<void> {
    if (!hasProfileConfigured) return;
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

        {!hasProfileConfigured && <ProfileRequiredNotice onOpenProfile={onOpenProfile} />}

        <Card muted>
          <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.contactsListTitle}</p>
          {contacts.length > 0 && (
            <TextInput
              type="text"
              soundKind={TextInputSoundKind.CONTACT_SEARCH}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={CONTACTS_STRINGS.searchFieldPlaceholder}
              className="w-full mt-2"
            />
          )}
          {contacts.length === 0 ? (
            <p className="text-text-dim text-xs mt-2">{CONTACTS_STRINGS.noContactsMessage}</p>
          ) : visibleContacts.length === 0 ? (
            <p className="text-text-dim text-xs mt-2">{CONTACTS_STRINGS.noContactsMatchMessage}</p>
          ) : (
            visibleContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onCall={handleCallContact}
                onEdit={updateContact}
                onRemove={removeContact}
                onToggleFavorite={handleToggleFavorite}
                disabled={busy || !hasProfileConfigured}
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
