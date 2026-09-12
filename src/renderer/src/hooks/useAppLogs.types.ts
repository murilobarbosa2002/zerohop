import type { LogEntry } from '@shared/logEntry';

export interface AppLogsState {
  entries: LogEntry[];
  clear: () => void;
}
