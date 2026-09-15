import { ipcMain, shell, desktopCapturer, clipboard, type DesktopCapturerSource } from 'electron';
import { getMainWindow } from '@main/window';
import {
  CAPTURE_SOURCE_TYPES,
  CAPTURE_THUMBNAIL_WIDTH,
  CAPTURE_THUMBNAIL_HEIGHT,
  NOISE_SOURCE_NAME_PATTERNS
} from '@main/constants/capture';
import { ALLOWED_EXTERNAL_URL_PROTOCOLS } from '@main/constants/externalUrl';
import { appendLog, readLogs, clearLogs } from '@main/logger';
import { getSettings, setHotkeySettings } from '@main/settings';
import { findProcessIdByWindowTitle, startAudioLoopback, stopAudioLoopback } from '@main/audioLoopback';
import { recordNextHotkey, cancelHotkeyRecording } from '@main/globalHotkeys';
import { applyToggleHotkeys } from '@main/toggleHotkeys';
import { readContacts, addContact, removeContact } from '@main/contacts';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { CaptureSource } from '@shared/ipc-types';
import type { LogEntry, NewLogEntry } from '@shared/logEntry';
import type { HotkeySettings, ToggleHotkeyRegistrationResult } from '@shared/hotkeySettings';
import type { Contact } from '@shared/contact';

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
  ipcMain.on(IPC_CHANNELS.focusWindow, () => {
    const win = getMainWindow();
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  });

  ipcMain.handle(IPC_CHANNELS.openExternalUrl, (_event, url: string) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return;
    }
    if (!ALLOWED_EXTERNAL_URL_PROTOCOLS.includes(parsed.protocol)) return;
    shell.openExternal(url);
  });

  ipcMain.handle(IPC_CHANNELS.logAppend, (_event, entry: NewLogEntry) => {
    appendLog(entry);
  });

  ipcMain.handle(IPC_CHANNELS.logList, (): LogEntry[] => readLogs());

  ipcMain.handle(IPC_CHANNELS.logClear, () => {
    clearLogs();
  });

  ipcMain.handle(IPC_CHANNELS.experimentalPerAppAudioGetEnabled, (): boolean => getSettings().experimentalPerAppAudioEnabled);

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

  ipcMain.handle(IPC_CHANNELS.getHotkeySettings, (): HotkeySettings => getSettings().hotkeys);

  ipcMain.handle(IPC_CHANNELS.setHotkeySettings, (_event, hotkeys: HotkeySettings): ToggleHotkeyRegistrationResult => {
    setHotkeySettings(hotkeys);
    return applyToggleHotkeys(hotkeys);
  });

  ipcMain.handle(IPC_CHANNELS.recordNextHotkey, (event) => {
    recordNextHotkey((binding) => {
      if (!event.sender.isDestroyed()) event.sender.send(IPC_CHANNELS.hotkeyRecorded, binding);
    });
  });

  ipcMain.handle(IPC_CHANNELS.cancelRecordHotkey, () => {
    cancelHotkeyRecording();
  });

  ipcMain.handle(IPC_CHANNELS.getContacts, (): Contact[] => readContacts());

  ipcMain.handle(IPC_CHANNELS.addContact, (_event, contact: Contact): Contact[] => addContact(contact));

  ipcMain.handle(IPC_CHANNELS.removeContact, (_event, id: string): Contact[] => removeContact(id));
}
