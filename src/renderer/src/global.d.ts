import type { CaptureSource } from '@shared/ipc-types';
import type { UpdaterStatus, UpdaterInfo } from '@shared/updaterStatus';
import type { LogEntry, NewLogEntry } from '@shared/logEntry';
import type { HotkeySettings, ToggleHotkeyRegistrationResult } from '@shared/hotkeySettings';
import type { Contact } from '@shared/contact';
import type { NotificationEntry, NewNotificationEntry } from '@shared/notificationEntry';

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
      getHotkeySettings: () => Promise<HotkeySettings>;
      setHotkeySettings: (hotkeys: HotkeySettings) => Promise<ToggleHotkeyRegistrationResult>;
      onHotkeySettingsChanged: (callback: (hotkeys: HotkeySettings) => void) => () => void;
      onHotkeyMicMuteToggle: (callback: () => void) => () => void;
      onHotkeyDeafenToggle: (callback: () => void) => () => void;
      onHotkeyPttActiveChanged: (callback: (active: boolean) => void) => () => void;
      onAppClosing: (callback: () => void) => () => void;
      getContacts: () => Promise<Contact[]>;
      addContact: (contact: Contact) => Promise<Contact[]>;
      removeContact: (id: string) => Promise<Contact[]>;
      getNotifications: () => Promise<NotificationEntry[]>;
      addNotification: (entry: NewNotificationEntry) => Promise<NotificationEntry>;
      onNotificationAdded: (callback: (entry: NotificationEntry) => void) => () => void;
      clearNotifications: () => Promise<void>;
      markNotificationRead: (id: string) => Promise<NotificationEntry[]>;
      markAllNotificationsRead: () => Promise<NotificationEntry[]>;
      deleteNotification: (id: string) => Promise<NotificationEntry[]>;
      onNotificationsChanged: (callback: (entries: NotificationEntry[]) => void) => () => void;
      getAllowUnknownInvites: () => Promise<boolean>;
      setAllowUnknownInvites: (value: boolean) => Promise<void>;
    };
  }
}

export {};
