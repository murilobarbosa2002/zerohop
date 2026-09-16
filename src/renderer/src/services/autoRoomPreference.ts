import {
  AUTO_ROOM_ID_STORAGE_KEY,
  AUTO_ROOM_PASSWORD_STORAGE_KEY,
  AUTO_ROOM_INVITE_IDS_STORAGE_KEY,
  AUTO_ROOM_ID_LENGTH,
  AUTO_ROOM_ID_ALPHABET
} from '@/constants/autoRoom';

function generateAutoRoomId(): string {
  let id = '';
  for (let i = 0; i < AUTO_ROOM_ID_LENGTH; i++) id += AUTO_ROOM_ID_ALPHABET[Math.floor(Math.random() * AUTO_ROOM_ID_ALPHABET.length)];
  return id;
}

export function getAutoRoomId(): string {
  const stored = localStorage.getItem(AUTO_ROOM_ID_STORAGE_KEY);
  if (stored) return stored;
  const generated = generateAutoRoomId();
  localStorage.setItem(AUTO_ROOM_ID_STORAGE_KEY, generated);
  return generated;
}

export function getAutoRoomPassword(): string {
  return localStorage.getItem(AUTO_ROOM_PASSWORD_STORAGE_KEY) ?? '';
}

export function setAutoRoomPassword(password: string): void {
  localStorage.setItem(AUTO_ROOM_PASSWORD_STORAGE_KEY, password);
}

export function getAutoInviteContactIds(): string[] {
  try {
    const stored = localStorage.getItem(AUTO_ROOM_INVITE_IDS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function setAutoInviteContactIds(ids: string[]): void {
  localStorage.setItem(AUTO_ROOM_INVITE_IDS_STORAGE_KEY, JSON.stringify(ids));
}
