import { ipcMain, shell, desktopCapturer, type DesktopCapturerSource } from 'electron';
import { getMainWindow } from '@main/window';
import { CAPTURE_SOURCE_TYPES, CAPTURE_THUMBNAIL_WIDTH, CAPTURE_THUMBNAIL_HEIGHT, NOISE_SOURCE_NAME_PATTERNS } from '@main/constants/capture';
import { ALLOWED_EXTERNAL_URL_PREFIX } from '@main/constants/externalUrl';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { CaptureSource } from '@shared/ipc-types';

function isNoiseSource(source: DesktopCapturerSource): boolean {
  return source.id.startsWith('window:') && NOISE_SOURCE_NAME_PATTERNS.some((pattern) => pattern.test(source.name));
}

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.getSources, async (): Promise<CaptureSource[]> => {
    const sources = await desktopCapturer.getSources({
      types: CAPTURE_SOURCE_TYPES,
      thumbnailSize: { width: CAPTURE_THUMBNAIL_WIDTH, height: CAPTURE_THUMBNAIL_HEIGHT }
    });
    return sources
      .filter((source) => !isNoiseSource(source))
      .map((source) => ({
        id: source.id,
        name: source.name,
        thumbnail: source.thumbnail.toDataURL()
      }));
  });

  ipcMain.on(IPC_CHANNELS.windowMinimize, () => getMainWindow()?.minimize());
  ipcMain.on(IPC_CHANNELS.windowMaximize, () => {
    const win = getMainWindow();
    if (!win) return;
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
  ipcMain.on(IPC_CHANNELS.windowClose, () => getMainWindow()?.close());

  ipcMain.handle(IPC_CHANNELS.openExternalUrl, (_event, url: string) => {
    if (!url.startsWith(ALLOWED_EXTERNAL_URL_PREFIX)) return;
    shell.openExternal(url);
  });
}
