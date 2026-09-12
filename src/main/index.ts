import { app, BrowserWindow, Menu, session } from 'electron';
import { createWindow } from '@main/window';
import { registerIpcHandlers } from '@main/ipc';
import { initAutoUpdater, registerUpdaterIpcHandlers } from '@main/updater';
import { APP_ID } from '@main/constants/app';

Menu.setApplicationMenu(null);

app.commandLine.appendSwitch('disable-features', 'WebRtcHideLocalIpsWithMdns');

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
