import { SOUND_EFFECTS_VOLUME_STORAGE_KEY, DEFAULT_SOUND_EFFECTS_VOLUME } from '@/constants/soundEffects';

const target = new EventTarget();

export function getSoundEffectsVolume(): number {
  const stored = localStorage.getItem(SOUND_EFFECTS_VOLUME_STORAGE_KEY);
  return stored ? Number(stored) : DEFAULT_SOUND_EFFECTS_VOLUME;
}

export function setSoundEffectsVolume(volume: number): void {
  localStorage.setItem(SOUND_EFFECTS_VOLUME_STORAGE_KEY, String(volume));
  target.dispatchEvent(new Event('volume-change'));
}

export function subscribeToSoundEffectsVolume(listener: () => void): () => void {
  target.addEventListener('volume-change', listener);
  return () => target.removeEventListener('volume-change', listener);
}
