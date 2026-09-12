export function setElementAudioOutput(element: HTMLMediaElement, deviceId: string): void {
  if (typeof element.setSinkId !== 'function') return;
  element.setSinkId(deviceId).catch(() => {});
}
