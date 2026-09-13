export enum AvatarId {
  FLOWER = 'flower',
  STAR = 'star',
  HEART = 'heart',
  BOLT = 'bolt',
  DISK = 'disk',
  GHOST = 'ghost',
  CAT = 'cat',
  NOTE = 'note'
}

export const DEFAULT_AVATAR_ID = AvatarId.FLOWER;

export const AVATAR_IDS: AvatarId[] = Object.values(AvatarId);

export function normalizeAvatarId(value: string): AvatarId {
  return (AVATAR_IDS as string[]).includes(value) ? (value as AvatarId) : DEFAULT_AVATAR_ID;
}

export const AVATAR_BACKGROUNDS: Record<AvatarId, string> = {
  [AvatarId.FLOWER]: '#000080',
  [AvatarId.STAR]: '#800000',
  [AvatarId.HEART]: '#a0004a',
  [AvatarId.BOLT]: '#b45f06',
  [AvatarId.DISK]: '#404040',
  [AvatarId.GHOST]: '#4b0082',
  [AvatarId.CAT]: '#5c3a21',
  [AvatarId.NOTE]: '#008080'
};
