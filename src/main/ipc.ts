import { ipcMain, shell, desktopCapturer, clipboard, type DesktopCapturerSource } from 'electron';
import { getMainWindow } from '@main/window';
import { CAPTURE_SOURCE_TYPES, CAPTURE_THUMBNAIL_WIDTH, CAPTURE_THUMBNAIL_HEIGHT, NOISE_SOURCE_NAME_PATTERNS } from '@main/constants/capture';
import { ALLOWED_EXTERNAL_URL_PREFIX } from '@main/constants/externalUrl';
import { appendLog, readLogs, clearLogs } from '@main/logger';
import { getSettings, setExperimentalWgcCaptureEnabled } from '@main/settings';
import { findProcessIdByWindowTitle, startAudioLoopback, stopAudioLoopback } from '@main/audioLoopback';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { CaptureSource } from '@shared/ipc-types';
import type { LogEntry, NewLogEntry } from '@shared/logEntry';

function isNoiseSource(source: DesktopCapturerSource): boolean {
  return source.id.startsWith('window:') && NOISE_SOURCE_NAME_PATTERNS.some((pattern) => pattern.test(source.name));
}

function deduplicateIdenticalWindows(sources: CaptureSource[]): CaptureSource[] {
  const seenNames = new Set<string>();
  return sources.filter((source) => {
    if (!source.id.startsWith('window:')) return true;
    if (seenNames.has(source.name)) return false;
    seenNames.add(source.name);
    return true;
  });
}

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.getSources, async (): Promise<CaptureSource[]> => {
    const sources = await desktopCapturer.getSources({
      types: CAPTURE_SOURCE_TYPES,
      thumbnailSize: { width: CAPTURE_THUMBNAIL_WIDTH, height: CAPTURE_THUMBNAIL_HEIGHT }
    });
    const captureSources = sources
      .filter((source) => !isNoiseSource(source))
      .map((source) => ({
        id: source.id,
        name: source.name,
        thumbnail: source.thumbnail.toDataURL()
      }));
    return deduplicateIdenticalWindows(captureSources);
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

  ipcMain.handle(IPC_CHANNELS.logAppend, (_event, entry: NewLogEntry) => {
    appendLog(entry);
  });

  ipcMain.handle(IPC_CHANNELS.logList, (): LogEntry[] => readLogs());

  ipcMain.handle(IPC_CHANNELS.logClear, () => {
    clearLogs();
  });

  ipcMain.handle(IPC_CHANNELS.experimentalCaptureGetEnabled, (): boolean => getSettings().experimentalWgcCaptureEnabled);

  ipcMain.handle(IPC_CHANNELS.experimentalCaptureSetEnabled, (_event, value: boolean) => {
    setExperimentalWgcCaptureEnabled(value);
  });

  ipcMain.handle(IPC_CHANNELS.audioLoopbackFindProcess, (_event, windowTitle: string): Promise<number | null> =>
    findProcessIdByWindowTitle(windowTitle)
  );

  ipcMain.on(IPC_CHANNELS.audioLoopbackStart, (event, processId: number) => {
    startAudioLoopback(processId, (chunk) => {
      if (!event.sender.isDestroyed()) event.sender.send(IPC_CHANNELS.audioLoopbackChunk, chunk);
    });
  });

  ipcMain.on(IPC_CHANNELS.audioLoopbackStop, () => {
    stopAudioLoopback();
  });

  ipcMain.handle(IPC_CHANNELS.copyToClipboard, (_event, text: string) => {
    clipboard.writeText(text);
  });
}
