import { app, BrowserWindow, Menu, session } from 'electron';
import { createWindow } from '@main/window';
import { registerIpcHandlers } from '@main/ipc';
import { initAutoUpdater, registerUpdaterIpcHandlers } from '@main/updater';
import { appendLog } from '@main/logger';
import { getSettings, ensureSettingsFileExists } from '@main/settings';
import { APP_ID } from '@main/constants/app';
import { EXPERIMENTAL_WGC_CAPTURE_FEATURES } from '@main/constants/capture';
import { EXPERIMENTAL_STRINGS } from '@main/strings/experimental.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';

Menu.setApplicationMenu(null);

app.commandLine.appendSwitch('disable-features', 'WebRtcHideLocalIpsWithMdns');

ensureSettingsFileExists();

if (getSettings().experimentalWgcCaptureEnabled) {
  app.commandLine.appendSwitch('enable-features', EXPERIMENTAL_WGC_CAPTURE_FEATURES);
  appendLog({ category: LogCategory.SHARING, level: LogLevel.INFO, message: EXPERIMENTAL_STRINGS.logCaptureModeActiveMessage });
}

app.setAppUserModelId(APP_ID);

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'media');
  });

  registerIpcHandlers();
  registerUpdaterIpcHandlers();
  createWindow();
  initAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
