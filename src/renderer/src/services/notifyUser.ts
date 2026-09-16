import type { NotificationKind } from '@shared/notificationEntry';

export function notifyUser(kind: NotificationKind, message: string, extra?: { inviteId?: string }): void {
  window.api.addNotification({ kind, message, ...extra });
}
