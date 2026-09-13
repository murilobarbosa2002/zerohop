import type { CaptureSource } from '@shared/ipc-types';
import type { UpdaterStatus, UpdaterInfo } from '@shared/updaterStatus';
import type { LogEntry, NewLogEntry } from '@shared/logEntry';

declare global {
  interface Window {
    api: {
      getSources: () => Promise<CaptureSource[]>;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      focusWindow: () => void;
      checkForUpdates: () => Promise<void>;
      installUpdate: () => Promise<void>;
      getUpdaterInfo: () => Promise<UpdaterInfo>;
      setAutoUpdateEnabled: (value: boolean) => Promise<void>;
      onUpdaterStatus: (callback: (status: UpdaterStatus) => void) => () => void;
      openExternalUrl: (url: string) => Promise<void>;
      appendLog: (entry: NewLogEntry) => Promise<void>;
      getLogs: () => Promise<LogEntry[]>;
      clearLogs: () => Promise<void>;
      onLogAdded: (callback: (entry: LogEntry) => void) => () => void;
      getExperimentalPerAppAudioEnabled: () => Promise<boolean>;
      findAudioProcessId: (windowTitle: string) => Promise<number | null>;
      startAudioLoopback: (processId: number) => void;
      stopAudioLoopback: () => void;
      onAudioLoopbackChunk: (callback: (chunk: Uint8Array) => void) => () => void;
      copyToClipboard: (text: string) => Promise<void>;
      setUiZoomFactor: (factor: number) => void;
    };
  }
}

export {};
