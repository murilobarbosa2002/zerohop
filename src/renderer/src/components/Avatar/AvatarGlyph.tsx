import { AvatarId } from '@/constants/avatars';
import type { AvatarGlyphProps } from '@/components/Avatar/Avatar.types';

const AVATAR_BG_HOLE = 'rgba(0,0,0,0.35)';

export function AvatarGlyph({ avatarId, size = 16 }: AvatarGlyphProps) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' };

  switch (avatarId) {
    case AvatarId.FLOWER:
      return (
        <svg {...common}>
          <g transform="translate(12 12)">
            <g id="avatar-petal">
              <path d="M0 -1.7 C 3.4 -1.7, 5.2 -6.2, 2.4 -9 C 0.5 -10.8, -0.5 -10.8, -2.4 -9 C -5.2 -6.2, -3.4 -1.7, 0 -1.7 Z" fill="#fff" />
            </g>
            <use href="#avatar-petal" transform="rotate(72)" />
            <use href="#avatar-petal" transform="rotate(144)" />
            <use href="#avatar-petal" transform="rotate(216)" />
            <use href="#avatar-petal" transform="rotate(288)" />
            <circle r="2.6" fill="#fff" fillOpacity="0.55" />
          </g>
        </svg>
      );
    case AvatarId.STAR:
      return (
        <svg {...common}>
          <path
            d="M12 2 L14.6 9 L22 9.4 L16.2 14 L18.2 21 L12 17 L5.8 21 L7.8 14 L2 9.4 L9.4 9 Z"
            fill="#fff"
          />
        </svg>
      );
    case AvatarId.HEART:
      return (
        <svg {...common}>
          <path
            d="M12 20 C 4 14, 2 9.5, 5 6.5 C 7.5 4, 11 5, 12 8 C 13 5, 16.5 4, 19 6.5 C 22 9.5, 20 14, 12 20 Z"
            fill="#fff"
          />
        </svg>
      );
    case AvatarId.BOLT:
      return (
        <svg {...common}>
          <path d="M13 2 L4 14 H10 L9 22 L20 9 H13 Z" fill="#fff" />
        </svg>
      );
    case AvatarId.DISK:
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1" fill="#fff" />
          <rect x="6" y="3" width="9" height="6" fill={AVATAR_BG_HOLE} />
          <rect x="7" y="14" width="10" height="6" fill={AVATAR_BG_HOLE} />
        </svg>
      );
    case AvatarId.GHOST:
      return (
        <svg {...common}>
          <path
            d="M6 21 V10 a6 6 0 0 1 12 0 v11 l-2.2 -2 -2 2 -1.8 -2 -2 2 -1.8 -2 Z"
            fill="#fff"
          />
        </svg>
      );
    case AvatarId.CAT:
      return (
        <svg {...common}>
          <path d="M6 4 L9 9 H15 L18 4 L15.5 10.5 A6 6 0 1 1 8.5 10.5 Z" fill="#fff" />
        </svg>
      );
    case AvatarId.NOTE:
      return (
        <svg {...common}>
          <circle cx="7" cy="18" r="3.2" fill="#fff" />
          <rect x="9.7" y="4" width="1.8" height="14.5" fill="#fff" />
          <path d="M11.5 4 L19 6.5 V10.5 L11.5 8 Z" fill="#fff" />
        </svg>
      );
    default:
      return null;
  }
}
