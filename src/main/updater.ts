import { app, ipcMain, Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import { UPDATER_STRINGS } from '@main/strings/updater.strings';
import { AUTO_UPDATE_CHECK_INTERVAL_MS } from '@main/constants/updater';
import { getMainWindow } from '@main/window';
import { getSettings, setAutoUpdateEnabled } from '@main/settings';
import { appendLog } from '@main/logger';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import { LogCategory, LogLevel } from '@shared/logEntry';
import type { UpdaterStatus, UpdaterInfo } from '@shared/updaterStatus';

function sendStatus(status: UpdaterStatus): void {
  getMainWindow()?.webContents.send(IPC_CHANNELS.updaterStatus, status);
}

function notifyUpdateDownloaded(version: string): void {
  if (!Notification.isSupported()) return;

  const notification = new Notification({
    title: UPDATER_STRINGS.notificationTitle,
    body: UPDATER_STRINGS.notificationBody(version)
  });
  notification.on('click', () => {
    const window = getMainWindow();
    if (!window) return;
    if (window.isMinimized()) window.restore();
    window.focus();
  });
  notification.show();
}

export function initAutoUpdater(): void {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;

  autoUpdater.on('checking-for-update', () => {
    appendLog({ category: LogCategory.UPDATE, level: LogLevel.INFO, message: UPDATER_STRINGS.logCheckingMessage });
  });

  autoUpdater.on('update-available', (info) => {
    appendLog({ category: LogCategory.UPDATE, level: LogLevel.INFO, message: UPDATER_STRINGS.logAvailableMessage(info.version) });
  });

  autoUpdater.on('update-downloaded', (info) => {
    notifyUpdateDownloaded(info.version);
    appendLog({ category: LogCategory.UPDATE, level: LogLevel.INFO, message: UPDATER_STRINGS.logDownloadedMessage(info.version) });
  });

  autoUpdater.on('error', (err) => {
    appendLog({ category: LogCategory.UPDATE, level: LogLevel.ERROR, message: UPDATER_STRINGS.logErrorMessage, detail: err.message });
  });

  if (getSettings().autoUpdateEnabled) autoUpdater.checkForUpdates();

  setInterval(() => {
    if (getSettings().autoUpdateEnabled) autoUpdater.checkForUpdates();
  }, AUTO_UPDATE_CHECK_INTERVAL_MS);
}

export function registerUpdaterIpcHandlers(): void {
  autoUpdater.on('checking-for-update', () => sendStatus({ type: 'checking' }));
  autoUpdater.on('update-available', (info) => sendStatus({ type: 'available', version: info.version }));
  autoUpdater.on('update-not-available', () => sendStatus({ type: 'not-available' }));
  autoUpdater.on('download-progress', (progress) => sendStatus({ type: 'downloading', percent: Math.round(progress.percent) }));
  autoUpdater.on('update-downloaded', (info) => sendStatus({ type: 'downloaded', version: info.version }));
  autoUpdater.on('error', (error) => sendStatus({ type: 'error', message: error.message }));

  ipcMain.handle(IPC_CHANNELS.updaterCheck, () => {
    if (!app.isPackaged) return;
    autoUpdater.checkForUpdates();
  });

  ipcMain.handle(IPC_CHANNELS.updaterInstall, () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.handle(IPC_CHANNELS.updaterGetInfo, (): UpdaterInfo => ({
    version: app.getVersion(),
    isPackaged: app.isPackaged,
    autoUpdateEnabled: getSettings().autoUpdateEnabled
  }));

  ipcMain.handle(IPC_CHANNELS.updaterSetAutoUpdateEnabled, (_event, value: boolean) => {
    setAutoUpdateEnabled(value);
  });
}
