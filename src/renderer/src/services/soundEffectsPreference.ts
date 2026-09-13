import {
  SoundCategory,
  SOUND_CATEGORIES,
  SOUND_EFFECTS_VOLUME_STORAGE_KEY,
  LEGACY_SOUND_EFFECTS_VOLUME_STORAGE_KEY,
  DEFAULT_SOUND_EFFECTS_VOLUME
} from '@/constants/soundEffects';

type VolumesByCategory = Record<SoundCategory, number>;

const target = new EventTarget();

function defaultVolumes(seed: number): VolumesByCategory {
  const volumes = {} as VolumesByCategory;
  for (const category of SOUND_CATEGORIES) volumes[category] = seed;
  return volumes;
}

function readVolumes(): VolumesByCategory {
  const stored = localStorage.getItem(SOUND_EFFECTS_VOLUME_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<VolumesByCategory>;
      const volumes = defaultVolumes(DEFAULT_SOUND_EFFECTS_VOLUME);
      for (const category of SOUND_CATEGORIES) {
        if (typeof parsed[category] === 'number') volumes[category] = parsed[category] as number;
      }
      return volumes;
    } catch {
      return defaultVolumes(DEFAULT_SOUND_EFFECTS_VOLUME);
    }
  }

  const legacy = localStorage.getItem(LEGACY_SOUND_EFFECTS_VOLUME_STORAGE_KEY);
  const seed = legacy ? Number(legacy) : DEFAULT_SOUND_EFFECTS_VOLUME;
  const volumes = defaultVolumes(seed);
  localStorage.setItem(SOUND_EFFECTS_VOLUME_STORAGE_KEY, JSON.stringify(volumes));
  return volumes;
}

export function getSoundEffectsVolume(category: SoundCategory): number {
  return readVolumes()[category];
}

export function setSoundEffectsVolume(category: SoundCategory, volume: number): void {
  const volumes = readVolumes();
  volumes[category] = volume;
  localStorage.setItem(SOUND_EFFECTS_VOLUME_STORAGE_KEY, JSON.stringify(volumes));
  target.dispatchEvent(new Event('volume-change'));
}

export function subscribeToSoundEffectsVolume(listener: () => void): () => void {
  target.addEventListener('volume-change', listener);
  return () => target.removeEventListener('volume-change', listener);
}
