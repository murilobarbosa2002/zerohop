export enum NotificationKind {
  INVITE_RECEIVED = 'invite-received',
  INVITE_ACCEPTED = 'invite-accepted',
  INVITE_DECLINED = 'invite-declined',
  MEMBER_JOINED = 'member-joined',
  MEMBER_LEFT = 'member-left',
  JOIN_REQUEST = 'join-request',
  UPDATE_AVAILABLE = 'update-available'
}

export interface NotificationEntry {
  id: string;
  timestamp: string;
  kind: NotificationKind;
  message: string;
  read: boolean;
}

export type NewNotificationEntry = Omit<NotificationEntry, 'id' | 'timestamp' | 'read'>;
