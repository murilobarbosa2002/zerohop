import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { CaptureSource } from '@shared/ipc-types';
import type { UpdaterStatus, UpdaterInfo } from '@shared/updaterStatus';

const api = {
  getSources: (): Promise<CaptureSource[]> => ipcRenderer.invoke(IPC_CHANNELS.getSources),
  minimize: (): void => ipcRenderer.send(IPC_CHANNELS.windowMinimize),
  maximize: (): void => ipcRenderer.send(IPC_CHANNELS.windowMaximize),
  close: (): void => ipcRenderer.send(IPC_CHANNELS.windowClose),
  checkForUpdates: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.updaterCheck),
  installUpdate: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.updaterInstall),
  getUpdaterInfo: (): Promise<UpdaterInfo> => ipcRenderer.invoke(IPC_CHANNELS.updaterGetInfo),
  onUpdaterStatus: (callback: (status: UpdaterStatus) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, status: UpdaterStatus): void => callback(status);
    ipcRenderer.on(IPC_CHANNELS.updaterStatus, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.updaterStatus, listener);
  },
  openExternalUrl: (url: string): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.openExternalUrl, url)
};

export type ScreenShareApi = typeof api;

contextBridge.exposeInMainWorld('api', api);
