import { contextBridge, ipcRenderer, webFrame } from 'electron';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { CaptureSource } from '@shared/ipc-types';
import type { UpdaterStatus, UpdaterInfo } from '@shared/updaterStatus';
import type { LogEntry, NewLogEntry } from '@shared/logEntry';
import type { HotkeySettings, HotkeyBinding, ToggleHotkeyRegistrationResult } from '@shared/hotkeySettings';
import type { Contact } from '@shared/contact';

const api = {
  getSources: (): Promise<CaptureSource[]> => ipcRenderer.invoke(IPC_CHANNELS.getSources),
  minimize: (): void => ipcRenderer.send(IPC_CHANNELS.windowMinimize),
  maximize: (): void => ipcRenderer.send(IPC_CHANNELS.windowMaximize),
  close: (): void => ipcRenderer.send(IPC_CHANNELS.windowClose),
  focusWindow: (): void => ipcRenderer.send(IPC_CHANNELS.focusWindow),
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
  getExperimentalPerAppAudioEnabled: (): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.experimentalPerAppAudioGetEnabled),
  findAudioProcessId: (windowTitle: string): Promise<number | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.audioLoopbackFindProcess, windowTitle),
  startAudioLoopback: (processId: number): void => ipcRenderer.send(IPC_CHANNELS.audioLoopbackStart, processId),
  stopAudioLoopback: (): void => ipcRenderer.send(IPC_CHANNELS.audioLoopbackStop),
  onAudioLoopbackChunk: (callback: (chunk: Uint8Array) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, chunk: Uint8Array): void => callback(chunk);
    ipcRenderer.on(IPC_CHANNELS.audioLoopbackChunk, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.audioLoopbackChunk, listener);
  },
  copyToClipboard: (text: string): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.copyToClipboard, text),
  setUiZoomFactor: (factor: number): void => {
    webFrame.setZoomFactor(factor);
  },
  getHotkeySettings: (): Promise<HotkeySettings> => ipcRenderer.invoke(IPC_CHANNELS.getHotkeySettings),
  setHotkeySettings: (hotkeys: HotkeySettings): Promise<ToggleHotkeyRegistrationResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.setHotkeySettings, hotkeys),
  recordNextHotkey: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.recordNextHotkey),
  cancelRecordHotkey: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.cancelRecordHotkey),
  onHotkeyRecorded: (callback: (binding: HotkeyBinding) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, binding: HotkeyBinding): void => callback(binding);
    ipcRenderer.on(IPC_CHANNELS.hotkeyRecorded, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.hotkeyRecorded, listener);
  },
  onHotkeyMicMuteToggle: (callback: () => void): (() => void) => {
    const listener = (): void => callback();
    ipcRenderer.on(IPC_CHANNELS.hotkeyMicMuteToggle, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.hotkeyMicMuteToggle, listener);
  },
  onHotkeyDeafenToggle: (callback: () => void): (() => void) => {
    const listener = (): void => callback();
    ipcRenderer.on(IPC_CHANNELS.hotkeyDeafenToggle, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.hotkeyDeafenToggle, listener);
  },
  onHotkeyPttActiveChanged: (callback: (active: boolean) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, active: boolean): void => callback(active);
    ipcRenderer.on(IPC_CHANNELS.hotkeyPttActiveChanged, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.hotkeyPttActiveChanged, listener);
  },
  onAppClosing: (callback: () => void): (() => void) => {
    const listener = (): void => callback();
    ipcRenderer.on(IPC_CHANNELS.appClosing, listener);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.appClosing, listener);
  },
  getContacts: (): Promise<Contact[]> => ipcRenderer.invoke(IPC_CHANNELS.getContacts),
  addContact: (contact: Contact): Promise<Contact[]> => ipcRenderer.invoke(IPC_CHANNELS.addContact, contact),
  removeContact: (id: string): Promise<Contact[]> => ipcRenderer.invoke(IPC_CHANNELS.removeContact, id)
};

export type ZeroHopApi = typeof api;

contextBridge.exposeInMainWorld('api', api);
