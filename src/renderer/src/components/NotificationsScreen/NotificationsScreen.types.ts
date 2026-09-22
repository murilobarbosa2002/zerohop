import type { NotificationEntry } from '@shared/notificationEntry';
import type { PendingInvite } from '@/hooks/useRoomSessions';

export interface NotificationsScreenProps {
  onBack: () => void;
  pendingInvites: PendingInvite[];
  onAcceptInvite: (inviteId: string) => void;
  onDeclineInvite: (inviteId: string) => void;
  onNavigate: (entry: NotificationEntry) => void;
}

export interface NotificationEntryRowProps {
  entry: NotificationEntry;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  isInvitePending: boolean;
  onAcceptInvite: (inviteId: string) => void;
  onDeclineInvite: (inviteId: string) => void;
  onNavigate: (entry: NotificationEntry) => void;
}

export interface ClearNotificationsConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}
