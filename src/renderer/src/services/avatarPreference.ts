import { AvatarId, DEFAULT_AVATAR_ID, AVATAR_IDS } from '@/constants/avatars';

const STORAGE_KEY = 'screenshare:avatarId';
const target = new EventTarget();

export function getAvatarId(): AvatarId {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && AVATAR_IDS.includes(stored as AvatarId) ? (stored as AvatarId) : DEFAULT_AVATAR_ID;
}

export function setAvatarId(avatarId: AvatarId): void {
  localStorage.setItem(STORAGE_KEY, avatarId);
  target.dispatchEvent(new Event('avatar-change'));
}

export function subscribeToAvatarId(listener: () => void): () => void {
  target.addEventListener('avatar-change', listener);
  return () => target.removeEventListener('avatar-change', listener);
}
