import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { NotificationEntryRow } from '@/components/NotificationsScreen/NotificationEntryRow';
import { ClearNotificationsConfirmation } from '@/components/NotificationsScreen/ClearNotificationsConfirmation';
import { Pagination } from '@/components/Pagination';
import { useNotifications } from '@/hooks/useNotifications';
import { usePagination } from '@/hooks/usePagination';
import {
  playNotificationsClearOpenSound,
  playNotificationsClearCancelSound,
  playNotificationsClearConfirmSound,
  playBackButtonSound
} from '@/services/soundEffects';
import { NOTIFICATIONS_STRINGS } from '@/strings/notifications.strings';
import { NOTIFICATIONS_PAGE_SIZE } from '@/constants/pagination';
import type { NotificationsScreenProps } from '@/components/NotificationsScreen/NotificationsScreen.types';

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { entries, clear, markRead, markAllRead } = useNotifications();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const sortedEntries = [...entries].reverse();
  const { pageItems, page, totalPages, setPage } = usePagination(sortedEntries, NOTIFICATIONS_PAGE_SIZE);

  function handleClear(): void {
    clear();
    playNotificationsClearConfirmSound();
    setConfirmingClear(false);
  }

  function handleCancelClear(): void {
    playNotificationsClearCancelSound();
    setConfirmingClear(false);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border flex-shrink-0">
        <button
          onClick={() => {
            playBackButtonSound();
            onBack();
          }}
          className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent"
        >
          {NOTIFICATIONS_STRINGS.backButton}
        </button>
        <p className="font-bold text-body-sm-alt">{NOTIFICATIONS_STRINGS.screenTitle}</p>
        <div className="ml-auto flex items-center gap-2">
          {entries.some((entry) => !entry.read) && (
            <ActionButton variant="default" className="flex-shrink-0" onClick={markAllRead}>
              {NOTIFICATIONS_STRINGS.markAllReadButton}
            </ActionButton>
          )}
          <ActionButton
            variant="default"
            className="flex-shrink-0"
            onClick={() => {
              playNotificationsClearOpenSound();
              setConfirmingClear(true);
            }}
          >
            {NOTIFICATIONS_STRINGS.clearButton}
          </ActionButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {confirmingClear && (
          <div className="mb-4">
            <ClearNotificationsConfirmation onConfirm={handleClear} onCancel={handleCancelClear} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {sortedEntries.length === 0 ? (
            <p className="text-text-dim text-body-sm">{NOTIFICATIONS_STRINGS.emptyMessage}</p>
          ) : (
            pageItems.map((entry) => <NotificationEntryRow key={entry.id} entry={entry} onRead={markRead} />)
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
