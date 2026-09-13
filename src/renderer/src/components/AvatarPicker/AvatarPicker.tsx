import { Avatar } from '@/components/Avatar';
import { AVATAR_IDS } from '@/constants/avatars';
import { playAvatarSelectSound } from '@/services/soundEffects';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import type { AvatarPickerProps } from '@/components/AvatarPicker/AvatarPicker.types';

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="mb-3">
      <p className="text-xs text-text-dim font-semibold mb-1.5">{PRE_ROOM_STRINGS.avatarFieldLabel}</p>
      <div className="flex flex-wrap gap-2">
        {AVATAR_IDS.map((avatarId) => (
          <Avatar
            key={avatarId}
            avatarId={avatarId}
            size={36}
            selected={avatarId === value}
            onClick={() => {
              onChange(avatarId);
              playAvatarSelectSound();
            }}
          />
        ))}
      </div>
    </div>
  );
}
