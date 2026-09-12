export function onTyped<T>(target: EventTarget, type: string, listener: (detail: T) => void): () => void {
  const handler = (event: Event): void => listener((event as CustomEvent<T>).detail);
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}
