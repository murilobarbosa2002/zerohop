const STORAGE_KEY = 'screenshare:userName';
const target = new EventTarget();

export function getName(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function setName(name: string): void {
  localStorage.setItem(STORAGE_KEY, name);
  target.dispatchEvent(new Event('name-change'));
}

export function subscribeToName(listener: () => void): () => void {
  target.addEventListener('name-change', listener);
  return () => target.removeEventListener('name-change', listener);
}
