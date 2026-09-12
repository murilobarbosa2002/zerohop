import { app, dialog, ipcMain, Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import { UPDATER_STRINGS } from '@main/strings/updater.strings';
import { RESTART_NOW_BUTTON_INDEX } from '@main/constants/updater';
import { getMainWindow } from '@main/window';
import { getSettings, setAutoUpdateEnabled } from '@main/settings';
import { IPC_CHANNELS } from '@shared/ipcChannels';
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

  autoUpdater.on('update-downloaded', (info) => {
    notifyUpdateDownloaded(info.version);

    dialog
      .showMessageBox({
        type: UPDATER_STRINGS.dialogType,
        title: UPDATER_STRINGS.dialogTitle,
        message: UPDATER_STRINGS.dialogMessage,
        buttons: [UPDATER_STRINGS.restartNowButton, UPDATER_STRINGS.restartLaterButton]
      })
      .then((result) => {
        if (result.response === RESTART_NOW_BUTTON_INDEX) autoUpdater.quitAndInstall();
      });
  });

  autoUpdater.on('error', (err) => console.error('[updater]', err));

  if (getSettings().autoUpdateEnabled) autoUpdater.checkForUpdates();
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
