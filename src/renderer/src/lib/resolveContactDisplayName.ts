import type { Contact } from '@shared/contact';

export function resolveContactDisplayName(broadcastName: string, personalId: string | null, contacts: Contact[]): string {
  if (!personalId) return broadcastName;
  const contact = contacts.find((entry) => entry.id === personalId);
  return contact ? contact.name : broadcastName;
}
