import { app, BrowserWindow, Menu } from 'electron';
import { createWindow } from '@main/window';
import { registerIpcHandlers } from '@main/ipc';
import { initAutoUpdater } from '@main/updater';

Menu.setApplicationMenu(null);

app.commandLine.appendSwitch('disable-features', 'WebRtcHideLocalIpsWithMdns');

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  initAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
