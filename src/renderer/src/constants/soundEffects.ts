export enum SoundCategory {
  INTERFACE = 'interface',
  ROOM = 'room',
  CHAT = 'chat',
  VOICE = 'voice',
  SHARING = 'sharing'
}

export const SOUND_CATEGORIES = [
  SoundCategory.INTERFACE,
  SoundCategory.ROOM,
  SoundCategory.CHAT,
  SoundCategory.VOICE,
  SoundCategory.SHARING
];

export const SOUND_EFFECTS_VOLUME_STORAGE_KEY = 'screenshare:soundEffectsVolumesV2';
export const LEGACY_SOUND_EFFECTS_VOLUME_STORAGE_KEY = 'screenshare:soundEffectsVolume';
export const DEFAULT_SOUND_EFFECTS_VOLUME = 0.15;
export const MIN_SOUND_EFFECTS_VOLUME = 0;
export const MAX_SOUND_EFFECTS_VOLUME = 1;
export const SOUND_EFFECTS_VOLUME_STEP = 0.05;
