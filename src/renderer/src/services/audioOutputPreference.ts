import { AUDIO_OUTPUT_STORAGE_KEY, SYSTEM_DEFAULT_AUDIO_OUTPUT_ID } from '@/constants/audioOutput';

const target = new EventTarget();

export function getAudioOutputDeviceId(): string {
  return localStorage.getItem(AUDIO_OUTPUT_STORAGE_KEY) ?? SYSTEM_DEFAULT_AUDIO_OUTPUT_ID;
}

export function setAudioOutputDeviceId(deviceId: string): void {
  localStorage.setItem(AUDIO_OUTPUT_STORAGE_KEY, deviceId);
  target.dispatchEvent(new Event('change'));
}

export function subscribeToAudioOutputDevice(listener: () => void): () => void {
  target.addEventListener('change', listener);
  return () => target.removeEventListener('change', listener);
}
