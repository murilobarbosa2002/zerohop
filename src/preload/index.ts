import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { CaptureSource } from '@shared/ipc-types';

const api = {
  getSources: (): Promise<CaptureSource[]> => ipcRenderer.invoke(IPC_CHANNELS.getSources),
  minimize: (): void => ipcRenderer.send(IPC_CHANNELS.windowMinimize),
  maximize: (): void => ipcRenderer.send(IPC_CHANNELS.windowMaximize),
  close: (): void => ipcRenderer.send(IPC_CHANNELS.windowClose)
};

export type ScreenShareApi = typeof api;

contextBridge.exposeInMainWorld('api', api);
