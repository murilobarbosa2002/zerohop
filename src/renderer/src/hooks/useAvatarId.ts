import { useSyncExternalStore } from 'react';
import { getAvatarId, setAvatarId, subscribeToAvatarId } from '@/services/avatarPreference';
import type { AvatarId } from '@/constants/avatars';

export function useAvatarId(): [AvatarId, (avatarId: AvatarId) => void] {
  const avatarId = useSyncExternalStore(subscribeToAvatarId, getAvatarId);
  return [avatarId, setAvatarId];
}
