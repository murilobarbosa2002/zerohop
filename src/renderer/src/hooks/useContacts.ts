import { useEffect, useState } from 'react';
import type { Contact } from '@shared/contact';

export function useContacts(): {
  contacts: Contact[];
  addContact: (contact: Contact) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
} {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    window.api.getContacts().then(setContacts);
  }, []);

  async function addContact(contact: Contact): Promise<void> {
    setContacts(await window.api.addContact(contact));
  }

  async function removeContact(id: string): Promise<void> {
    setContacts(await window.api.removeContact(id));
  }

  return { contacts, addContact, removeContact };
}
