import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { notificationDotVariants } from '@/components/NotificationsScreen/NotificationsScreen.variants';
import {
  playNotificationReadSound,
  playDeleteNotificationOpenSound,
  playDeleteNotificationConfirmSound,
  playNotificationsClearCancelSound
} from '@/services/soundEffects';
import { NOTIFICATIONS_STRINGS } from '@/strings/notifications.strings';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { NotificationEntryRowProps } from '@/components/NotificationsScreen/NotificationsScreen.types';

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' });
}

export function NotificationEntryRow({
  entry,
  onRead,
  onDelete,
  isInvitePending,
  onAcceptInvite,
  onDeclineInvite
}: NotificationEntryRowProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleRead(): void {
    if (!entry.read) playNotificationReadSound();
    onRead(entry.id);
  }

  return (
    <div className={`bg-panel-2 border border-border rounded-lg px-3 py-2.5 flex gap-2.5 ${entry.read ? '' : 'border-accent'}`}>
      <button onClick={handleRead} className="flex-1 min-w-0 text-left flex gap-2.5">
        <span className={notificationDotVariants({ kind: entry.kind })} />
        <div className="flex-1 min-w-0">
          <p className="text-body-sm-alt">{entry.message}</p>
          <p className="text-text-dim text-sm mt-1">{formatTimestamp(entry.timestamp)}</p>
        </div>
      </button>
      {isInvitePending && entry.inviteId ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <ActionButton variant="default" onClick={() => onDeclineInvite(entry.inviteId as string)}>
            {ROOM_STRINGS.inviteReceivedDeclineButton}
          </ActionButton>
          <ActionButton variant="primary" onClick={() => onAcceptInvite(entry.inviteId as string)}>
            {ROOM_STRINGS.inviteReceivedAcceptButton}
          </ActionButton>
        </div>
      ) : confirmingDelete ? (
        <div className="flex items-center gap-2 flex-shrink-0">
          <ActionButton
            variant="default"
            onClick={() => {
              playNotificationsClearCancelSound();
              setConfirmingDelete(false);
            }}
          >
            {NOTIFICATIONS_STRINGS.deleteCancelButton}
          </ActionButton>
          <ActionButton
            variant="danger"
            onClick={() => {
              playDeleteNotificationConfirmSound();
              onDelete(entry.id);
            }}
          >
            {NOTIFICATIONS_STRINGS.deleteConfirmButton}
          </ActionButton>
        </div>
      ) : (
        <ActionButton
          variant="danger"
          className="flex-shrink-0 self-start"
          onClick={() => {
            playDeleteNotificationOpenSound();
            setConfirmingDelete(true);
          }}
        >
          {NOTIFICATIONS_STRINGS.deleteButton}
        </ActionButton>
      )}
    </div>
  );
}
