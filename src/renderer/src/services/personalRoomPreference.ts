import {
  PERSONAL_ID_STORAGE_KEY,
  PERSONAL_PASSWORD_STORAGE_KEY,
  PERSONAL_AUTO_OPEN_STORAGE_KEY,
  PERSONAL_PASSWORD_REMINDER_LAST_SHOWN_STORAGE_KEY,
  PERSONAL_ID_LENGTH,
  PERSONAL_ID_ALPHABET
} from '@/constants/personalRoom';

const target = new EventTarget();

function generatePersonalId(): string {
  let id = '';
  for (let i = 0; i < PERSONAL_ID_LENGTH; i++) id += PERSONAL_ID_ALPHABET[Math.floor(Math.random() * PERSONAL_ID_ALPHABET.length)];
  return id;
}

export function getPersonalId(): string {
  const stored = localStorage.getItem(PERSONAL_ID_STORAGE_KEY);
  if (stored) return stored;
  const generated = generatePersonalId();
  localStorage.setItem(PERSONAL_ID_STORAGE_KEY, generated);
  return generated;
}

export function getPersonalPassword(): string {
  return localStorage.getItem(PERSONAL_PASSWORD_STORAGE_KEY) ?? '';
}

export function setPersonalPassword(password: string): void {
  localStorage.setItem(PERSONAL_PASSWORD_STORAGE_KEY, password);
  target.dispatchEvent(new Event('personal-password-change'));
}

export function subscribeToPersonalPassword(listener: () => void): () => void {
  target.addEventListener('personal-password-change', listener);
  return () => target.removeEventListener('personal-password-change', listener);
}

export function getPersonalAutoOpenEnabled(): boolean {
  const stored = localStorage.getItem(PERSONAL_AUTO_OPEN_STORAGE_KEY);
  return stored === null ? true : stored === 'true';
}

export function setPersonalAutoOpenEnabled(enabled: boolean): void {
  localStorage.setItem(PERSONAL_AUTO_OPEN_STORAGE_KEY, String(enabled));
  target.dispatchEvent(new Event('personal-auto-open-change'));
}

export function subscribeToPersonalAutoOpenEnabled(listener: () => void): () => void {
  target.addEventListener('personal-auto-open-change', listener);
  return () => target.removeEventListener('personal-auto-open-change', listener);
}

export function getPersonalPasswordReminderLastShownDate(): string | null {
  return localStorage.getItem(PERSONAL_PASSWORD_REMINDER_LAST_SHOWN_STORAGE_KEY);
}

export function setPersonalPasswordReminderLastShownDate(date: string): void {
  localStorage.setItem(PERSONAL_PASSWORD_REMINDER_LAST_SHOWN_STORAGE_KEY, date);
}

export function hasPersonalRoomBeenConfigured(): boolean {
  return localStorage.getItem(PERSONAL_AUTO_OPEN_STORAGE_KEY) !== null || localStorage.getItem(PERSONAL_PASSWORD_STORAGE_KEY) !== null;
}
