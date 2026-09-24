const STORAGE_KEY = 'screenshare:userStatus';
const target = new EventTarget();

export function getStatus(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function setStatus(status: string): void {
  localStorage.setItem(STORAGE_KEY, status);
  target.dispatchEvent(new Event('status-change'));
}

export function subscribeToStatus(listener: () => void): () => void {
  target.addEventListener('status-change', listener);
  return () => target.removeEventListener('status-change', listener);
}
