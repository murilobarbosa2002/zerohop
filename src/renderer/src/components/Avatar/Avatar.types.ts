import type { AvatarId } from '@/constants/avatars';

export interface AvatarGlyphProps {
  avatarId: AvatarId;
  size?: number;
}

export interface AvatarProps {
  avatarId: AvatarId | null | undefined;
  fallbackLetter?: string;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
}
