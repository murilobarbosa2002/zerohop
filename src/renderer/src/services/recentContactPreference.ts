import { RECENT_CONTACTS_STORAGE_KEY, RECENT_CONTACTS_MAX } from '@/constants/recentContacts';

export function getRecentContactIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_CONTACTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function recordRecentContact(contactId: string): void {
  const next = [contactId, ...getRecentContactIds().filter((id) => id !== contactId)].slice(0, RECENT_CONTACTS_MAX);
  localStorage.setItem(RECENT_CONTACTS_STORAGE_KEY, JSON.stringify(next));
}
