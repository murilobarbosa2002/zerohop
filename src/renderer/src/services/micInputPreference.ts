import {
  MIC_INPUT_DEVICE_STORAGE_KEY,
  MIC_INPUT_GAIN_STORAGE_KEY,
  SYSTEM_DEFAULT_MIC_INPUT_ID,
  DEFAULT_MIC_GAIN
} from '@/constants/micInput';

const target = new EventTarget();

export function getMicInputDeviceId(): string {
  return localStorage.getItem(MIC_INPUT_DEVICE_STORAGE_KEY) ?? SYSTEM_DEFAULT_MIC_INPUT_ID;
}

export function setMicInputDeviceId(deviceId: string): void {
  localStorage.setItem(MIC_INPUT_DEVICE_STORAGE_KEY, deviceId);
  target.dispatchEvent(new Event('device-change'));
}

export function subscribeToMicInputDevice(listener: () => void): () => void {
  target.addEventListener('device-change', listener);
  return () => target.removeEventListener('device-change', listener);
}

export function getMicInputGain(): number {
  const stored = localStorage.getItem(MIC_INPUT_GAIN_STORAGE_KEY);
  return stored ? Number(stored) : DEFAULT_MIC_GAIN;
}

export function setMicInputGain(gain: number): void {
  localStorage.setItem(MIC_INPUT_GAIN_STORAGE_KEY, String(gain));
  target.dispatchEvent(new Event('gain-change'));
}

export function subscribeToMicInputGain(listener: () => void): () => void {
  target.addEventListener('gain-change', listener);
  return () => target.removeEventListener('gain-change', listener);
}
