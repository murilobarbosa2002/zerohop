import { useEffect, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import { contactsPresenceStore, type ContactsPresenceEventDetail } from '@/services/contactsPresenceStore';
import type { Contact } from '@shared/contact';

export function useContactsPresence(contacts: Contact[]): Map<string, boolean> {
  useEffect(() => {
    contactsPresenceStore.setContactIds(contacts.map((contact) => contact.id));
  }, [contacts]);

  return useSyncExternalStore(
    (onStoreChange) => onTyped<ContactsPresenceEventDetail['changed']>(contactsPresenceStore, 'changed', () => onStoreChange()),
    () => contactsPresenceStore.getSnapshot()
  );
}
