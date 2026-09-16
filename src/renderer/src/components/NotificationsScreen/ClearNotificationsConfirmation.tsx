import { ActionButton } from '@/components/ActionButton';
import { NOTIFICATIONS_STRINGS } from '@/strings/notifications.strings';
import type { ClearNotificationsConfirmationProps } from '@/components/NotificationsScreen/NotificationsScreen.types';

export function ClearNotificationsConfirmation({ onConfirm, onCancel }: ClearNotificationsConfirmationProps) {
  return (
    <div className="bg-panel-2 border border-border rounded-lg px-3 py-2.5 flex items-center gap-3 flex-wrap">
      <p className="text-body-sm flex-1">{NOTIFICATIONS_STRINGS.clearConfirmMessage}</p>
      <div className="flex gap-2">
        <ActionButton variant="default" onClick={onCancel}>
          {NOTIFICATIONS_STRINGS.clearCancelButton}
        </ActionButton>
        <ActionButton variant="danger" onClick={onConfirm}>
          {NOTIFICATIONS_STRINGS.clearConfirmButton}
        </ActionButton>
      </div>
    </div>
  );
}
