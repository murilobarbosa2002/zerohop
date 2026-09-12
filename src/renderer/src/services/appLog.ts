import type { LogCategory, LogLevel } from '@shared/logEntry';

export function logEvent(category: LogCategory, level: LogLevel, message: string, detail?: string): void {
  window.api.appendLog({ category, level, message, detail });
}
