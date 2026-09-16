export enum NotificationKind {
  INVITE_RECEIVED = 'invite-received',
  INVITE_ACCEPTED = 'invite-accepted',
  INVITE_DECLINED = 'invite-declined',
  MEMBER_JOINED = 'member-joined',
  MEMBER_LEFT = 'member-left',
  JOIN_REQUEST = 'join-request',
  UPDATE_AVAILABLE = 'update-available'
}

export enum NotificationCategory {
  INVITES = 'invites',
  ROOM = 'room',
  SYSTEM = 'system'
}

export const NOTIFICATION_KIND_CATEGORY: Record<NotificationKind, NotificationCategory> = {
  [NotificationKind.INVITE_RECEIVED]: NotificationCategory.INVITES,
  [NotificationKind.INVITE_ACCEPTED]: NotificationCategory.INVITES,
  [NotificationKind.INVITE_DECLINED]: NotificationCategory.INVITES,
  [NotificationKind.MEMBER_JOINED]: NotificationCategory.ROOM,
  [NotificationKind.MEMBER_LEFT]: NotificationCategory.ROOM,
  [NotificationKind.JOIN_REQUEST]: NotificationCategory.ROOM,
  [NotificationKind.UPDATE_AVAILABLE]: NotificationCategory.SYSTEM
};

export interface NotificationEntry {
  id: string;
  timestamp: string;
  kind: NotificationKind;
  message: string;
  read: boolean;
}

export type NewNotificationEntry = Omit<NotificationEntry, 'id' | 'timestamp' | 'read'>;
