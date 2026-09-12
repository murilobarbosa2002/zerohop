import { app } from 'electron';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { LOG_FILE_NAME, LOG_FILE_MAX_ENTRIES } from '@main/constants/logging';
import { getMainWindow } from '@main/window';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { LogEntry, NewLogEntry } from '@shared/logEntry';

function getLogFilePath(): string {
  return join(app.getPath('userData'), LOG_FILE_NAME);
}

export function readLogs(): LogEntry[] {
  const path = getLogFilePath();
  if (!existsSync(path)) return [];

  const raw = readFileSync(path, 'utf-8');
  return raw
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as LogEntry];
      } catch {
        return [];
      }
    });
}

export function clearLogs(): void {
  writeFileSync(getLogFilePath(), '', 'utf-8');
}

export function appendLog(entry: NewLogEntry): LogEntry {
  const fullEntry: LogEntry = { ...entry, id: randomUUID(), timestamp: new Date().toISOString() };

  const existing = readLogs();
  const truncated = existing.length >= LOG_FILE_MAX_ENTRIES ? existing.slice(existing.length - LOG_FILE_MAX_ENTRIES + 1) : existing;
  const lines = [...truncated, fullEntry].map((line) => JSON.stringify(line));
  writeFileSync(getLogFilePath(), lines.join('\n') + '\n', 'utf-8');

  getMainWindow()?.webContents.send(IPC_CHANNELS.logAdded, fullEntry);
  return fullEntry;
}
