import { AvatarGlyph } from '@/components/Avatar/AvatarGlyph';
import { AVATAR_BACKGROUNDS } from '@/constants/avatars';
import type { AvatarProps } from '@/components/Avatar/Avatar.types';

export function Avatar({ avatarId, fallbackLetter, size = 26, selected, onClick }: AvatarProps) {
  const background = avatarId ? AVATAR_BACKGROUNDS[avatarId] : undefined;

  const content = avatarId ? (
    <AvatarGlyph avatarId={avatarId} size={Math.round(size * 0.62)} />
  ) : (
    <span className="font-bold text-text-on-accent" style={{ fontSize: size * 0.5 }}>
      {fallbackLetter}
    </span>
  );

  const Tag = onClick ? 'button' : 'span';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`rounded-full flex items-center justify-center flex-shrink-0 border-0 p-0 m-0 bg-transparent appearance-none leading-none ${
        !avatarId ? 'bg-gradient-to-br from-accent to-accent-2' : ''
      } ${selected ? 'ring-2 ring-offset-2 ring-offset-bg ring-accent' : ''}`}
      style={{ width: size, height: size, background }}
    >
      {content}
    </Tag>
  );
}
