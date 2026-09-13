import { UI_SCALE_STORAGE_KEY, DEFAULT_UI_SCALE } from '@/constants/uiScale';

const target = new EventTarget();

export function getUiScale(): number {
  const stored = localStorage.getItem(UI_SCALE_STORAGE_KEY);
  return stored ? Number(stored) : DEFAULT_UI_SCALE;
}

export function setUiScale(scale: number): void {
  localStorage.setItem(UI_SCALE_STORAGE_KEY, String(scale));
  window.api.setUiZoomFactor(scale);
  target.dispatchEvent(new Event('scale-change'));
}

export function subscribeToUiScale(listener: () => void): () => void {
  target.addEventListener('scale-change', listener);
  return () => target.removeEventListener('scale-change', listener);
}
