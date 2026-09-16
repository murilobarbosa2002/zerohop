import type { NotificationEntry } from '@shared/notificationEntry';

export interface NotificationsScreenProps {
  onBack: () => void;
}

export interface NotificationEntryRowProps {
  entry: NotificationEntry;
  onRead: (id: string) => void;
}

export interface ClearNotificationsConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}
