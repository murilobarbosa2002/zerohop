import {
  EXPERIMENTAL_PER_APP_AUDIO_STORAGE_KEY,
  DEFAULT_EXPERIMENTAL_PER_APP_AUDIO_ENABLED
} from '@/constants/experimentalPerAppAudio';

const target = new EventTarget();

export function getExperimentalPerAppAudioEnabled(): boolean {
  const stored = localStorage.getItem(EXPERIMENTAL_PER_APP_AUDIO_STORAGE_KEY);
  return stored === null ? DEFAULT_EXPERIMENTAL_PER_APP_AUDIO_ENABLED : stored === 'true';
}

export function setExperimentalPerAppAudioEnabled(enabled: boolean): void {
  localStorage.setItem(EXPERIMENTAL_PER_APP_AUDIO_STORAGE_KEY, String(enabled));
  target.dispatchEvent(new Event('change'));
}

export function subscribeToExperimentalPerAppAudio(listener: () => void): () => void {
  target.addEventListener('change', listener);
  return () => target.removeEventListener('change', listener);
}
