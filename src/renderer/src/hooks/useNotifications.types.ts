import type { NotificationEntry } from '@shared/notificationEntry';

export interface NotificationsState {
  entries: NotificationEntry[];
  unreadCount: number;
  clear: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
}
