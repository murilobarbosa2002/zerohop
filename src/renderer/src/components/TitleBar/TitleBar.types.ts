export interface TitleBarProps {
  onOpenUpdates: () => void;
  onOpenSettings: () => void;
  onOpenLogs: () => void;
  onOpenNotifications: () => void;
  onOpenContacts: () => void;
  unreadNotificationsCount: number;
}
