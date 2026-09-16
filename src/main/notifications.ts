import { app } from 'electron';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NOTIFICATIONS_FILE_NAME, NOTIFICATIONS_FILE_MAX_ENTRIES } from '@main/constants/notifications';
import { getMainWindow } from '@main/window';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import type { NotificationEntry, NewNotificationEntry } from '@shared/notificationEntry';

function getNotificationsFilePath(): string {
  return join(app.getPath('userData'), NOTIFICATIONS_FILE_NAME);
}

export function readNotifications(): NotificationEntry[] {
  const path = getNotificationsFilePath();
  if (!existsSync(path)) return [];

  const raw = readFileSync(path, 'utf-8');
  return raw
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as NotificationEntry];
      } catch {
        return [];
      }
    });
}

function writeNotifications(entries: NotificationEntry[]): void {
  const lines = entries.map((entry) => JSON.stringify(entry));
  writeFileSync(getNotificationsFilePath(), lines.length > 0 ? lines.join('\n') + '\n' : '', 'utf-8');
}

export function clearNotifications(): void {
  writeNotifications([]);
}

export function appendNotification(entry: NewNotificationEntry): NotificationEntry {
  const fullEntry: NotificationEntry = { ...entry, id: randomUUID(), timestamp: new Date().toISOString(), read: false };

  const existing = readNotifications();
  const truncated =
    existing.length >= NOTIFICATIONS_FILE_MAX_ENTRIES ? existing.slice(existing.length - NOTIFICATIONS_FILE_MAX_ENTRIES + 1) : existing;
  writeNotifications([...truncated, fullEntry]);

  getMainWindow()?.webContents.send(IPC_CHANNELS.notificationAdded, fullEntry);
  return fullEntry;
}

export function markNotificationRead(id: string): NotificationEntry[] {
  const entries = readNotifications().map((entry) => (entry.id === id ? { ...entry, read: true } : entry));
  writeNotifications(entries);
  return entries;
}

export function markAllNotificationsRead(): NotificationEntry[] {
  const entries = readNotifications().map((entry) => ({ ...entry, read: true }));
  writeNotifications(entries);
  return entries;
}
