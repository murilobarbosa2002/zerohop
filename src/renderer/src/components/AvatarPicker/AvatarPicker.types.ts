import type { AvatarId } from '@/constants/avatars';

export interface AvatarPickerProps {
  value: AvatarId;
  onChange: (avatarId: AvatarId) => void;
}
