import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { CaptureSource } from '@shared/ipc-types';
import type { UpdaterStatus, UpdaterInfo } from '@shared/updaterStatus';
import type { LogEntry, NewLogEntry } from '@shared/logEntry';

const api = {
  getSources: (): Promise<CaptureSource[]> => ipcRenderer.invoke(IPC_CHANNELS.getSources),
  minimize: (): void => ipcRenderer.send(IPC_CHANNELS.windowMinimize),
  maximize: (): void => ipcRenderer.send(IPC_CHANNELS.windowMaximize),
  close: (): void => ipcRenderer.send(IPC_CHANNELS.windowClose),
  checkForUpdates: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.updaterCheck),
  installUpdate: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.updaterInstall),
  getUpdaterInfo: (): Promise<UpdaterInfo> => ipcRenderer.invoke(IPC_CHANNELS.updaterGetInfo),
  setAutoUpdateEnabled: (value: boolean): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.updaterSetAutoUpdateEnabled, value),
  onUpdaterStatus: (callback: (status: UpdaterStatus) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, status: UpdaterStatus): void => callback(status);
    ipcRenderer.on(IPC_CHANNELS.updaterStatus, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.updaterStatus, listener);
  },
  openExternalUrl: (url: string): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.openExternalUrl, url),
  appendLog: (entry: NewLogEntry): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.logAppend, entry),
  getLogs: (): Promise<LogEntry[]> => ipcRenderer.invoke(IPC_CHANNELS.logList),
  clearLogs: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.logClear),
  onLogAdded: (callback: (entry: LogEntry) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, entry: LogEntry): void => callback(entry);
    ipcRenderer.on(IPC_CHANNELS.logAdded, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.logAdded, listener);
  },
  getExperimentalCaptureEnabled: (): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.experimentalCaptureGetEnabled),
  setExperimentalCaptureEnabled: (value: boolean): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.experimentalCaptureSetEnabled, value),
  getExperimentalPerAppAudioEnabled: (): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.experimentalPerAppAudioGetEnabled),
  setExperimentalPerAppAudioEnabled: (value: boolean): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.experimentalPerAppAudioSetEnabled, value),
  findAudioProcessId: (windowTitle: string): Promise<number | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.audioLoopbackFindProcess, windowTitle),
  startAudioLoopback: (processId: number): void => ipcRenderer.send(IPC_CHANNELS.audioLoopbackStart, processId),
  stopAudioLoopback: (): void => ipcRenderer.send(IPC_CHANNELS.audioLoopbackStop),
  onAudioLoopbackChunk: (callback: (chunk: Uint8Array) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, chunk: Uint8Array): void => callback(chunk);
    ipcRenderer.on(IPC_CHANNELS.audioLoopbackChunk, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.audioLoopbackChunk, listener);
  },
  copyToClipboard: (text: string): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.copyToClipboard, text)
};

export type ZeroHopApi = typeof api;

contextBridge.exposeInMainWorld('api', api);
