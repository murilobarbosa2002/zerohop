import { app } from 'electron';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { CONTACTS_FILE_NAME } from '@main/constants/contacts';
import type { Contact } from '@shared/contact';

function getContactsFilePath(): string {
  return join(app.getPath('userData'), CONTACTS_FILE_NAME);
}

function isContact(value: unknown): value is Contact {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string' && typeof candidate.name === 'string' && typeof candidate.password === 'string';
}

export function readContacts(): Contact[] {
  try {
    const raw = readFileSync(getContactsFilePath(), 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isContact) : [];
  } catch {
    return [];
  }
}

function writeContacts(contacts: Contact[]): void {
  writeFileSync(getContactsFilePath(), JSON.stringify(contacts, null, 2), 'utf-8');
}

export function addContact(contact: Contact): Contact[] {
  if (!isContact(contact)) return readContacts();
  const contacts = readContacts().filter((existing) => existing.id !== contact.id);
  contacts.push(contact);
  writeContacts(contacts);
  return contacts;
}

export function updateContact(originalId: string, contact: Contact): Contact[] {
  if (!isContact(contact)) return readContacts();
  const contacts = readContacts().filter((existing) => existing.id !== originalId && existing.id !== contact.id);
  contacts.push(contact);
  writeContacts(contacts);
  return contacts;
}

export function removeContact(id: string): Contact[] {
  const contacts = readContacts().filter((existing) => existing.id !== id);
  writeContacts(contacts);
  return contacts;
}

export function ensureContactsFileExists(): void {
  const path = getContactsFilePath();
  if (existsSync(path)) return;
  writeContacts([]);
}
