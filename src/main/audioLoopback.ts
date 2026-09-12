import type LoopbackCaptureModule from 'loopback-capture';
import type { windowManager as WindowManagerModule } from 'node-window-manager';

let activeCapture: InstanceType<(typeof LoopbackCaptureModule)['LoopbackCapture']> | null = null;

async function loadLoopbackCapture(): Promise<typeof LoopbackCaptureModule | null> {
  try {
    return (await import('loopback-capture')).default;
  } catch {
    return null;
  }
}

async function loadWindowManager(): Promise<typeof WindowManagerModule | null> {
  try {
    return (await import('node-window-manager')).windowManager;
  } catch {
    return null;
  }
}

export async function findProcessIdByWindowTitle(title: string): Promise<number | null> {
  const windowManager = await loadWindowManager();
  if (!windowManager) return null;
  const match = windowManager.getWindows().find((win) => win.getTitle() === title);
  return match ? match.processId : null;
}

export async function startAudioLoopback(processId: number, onChunk: (chunk: Buffer) => void): Promise<void> {
  stopAudioLoopback();
  const loopback = await loadLoopbackCapture();
  if (!loopback) return;
  activeCapture = new loopback.LoopbackCapture();
  activeCapture.start(processId, true, onChunk);
}

export function stopAudioLoopback(): void {
  activeCapture?.stop();
  activeCapture = null;
}
