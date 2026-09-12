import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import { UPDATER_STRINGS } from '@main/strings/updater.strings';
import { RESTART_NOW_BUTTON_INDEX } from '@main/constants/updater';

export function initAutoUpdater(): void {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;

  autoUpdater.on('update-downloaded', () => {
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

  autoUpdater.checkForUpdates();
}
