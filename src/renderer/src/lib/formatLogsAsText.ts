import { LOG_STRINGS } from '@/strings/logs.strings';
import type { LogEntry } from '@shared/logEntry';

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' });
}

export function formatLogsAsText(entries: LogEntry[]): string {
  return entries
    .map((entry) => {
      const category = LOG_STRINGS.categoryLabels[entry.category];
      const line = `[${formatTimestamp(entry.timestamp)}] [${entry.level.toUpperCase()}] [${category}] ${entry.message}`;
      return entry.detail ? `${line}\n  ${entry.detail}` : line;
    })
    .join('\n');
}
