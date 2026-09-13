export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum LogCategory {
  APP = 'app',
  ROOM = 'room',
  SHARING = 'sharing',
  VOICE = 'voice',
  CONNECTION = 'connection',
  UPDATE = 'update',
  HOTKEYS = 'hotkeys'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  detail?: string;
}

export type NewLogEntry = Omit<LogEntry, 'id' | 'timestamp'>;
