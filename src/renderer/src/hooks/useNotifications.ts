import { useCallback, useEffect, useState } from 'react';
import type { NotificationEntry } from '@shared/notificationEntry';
import type { NotificationsState } from '@/hooks/useNotifications.types';

export function useNotifications(): NotificationsState {
  const [entries, setEntries] = useState<NotificationEntry[]>([]);

  useEffect(() => {
    window.api.getNotifications().then(setEntries);
  }, []);

  useEffect(() => window.api.onNotificationAdded((entry) => setEntries((current) => [...current, entry])), []);

  const clear = useCallback(() => {
    window.api.clearNotifications();
    setEntries([]);
  }, []);

  const markRead = useCallback((id: string) => {
    setEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)));
    window.api.markNotificationRead(id);
  }, []);

  const markAllRead = useCallback(() => {
    setEntries((current) => current.map((entry) => ({ ...entry, read: true })));
    window.api.markAllNotificationsRead();
  }, []);

  const unreadCount = entries.filter((entry) => !entry.read).length;

  return { entries, unreadCount, clear, markRead, markAllRead };
}
