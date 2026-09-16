import { useMemo, useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { NotificationEntryRow } from '@/components/NotificationsScreen/NotificationEntryRow';
import { ClearNotificationsConfirmation } from '@/components/NotificationsScreen/ClearNotificationsConfirmation';
import { Pagination } from '@/components/Pagination';
import { useNotifications } from '@/hooks/useNotifications';
import { usePagination } from '@/hooks/usePagination';
import { readSelectedValues } from '@/lib/selectValues';
import {
  playNotificationsClearOpenSound,
  playNotificationsClearCancelSound,
  playNotificationsClearConfirmSound,
  playMarkAllNotificationsReadSound,
  playNotificationFilterToggleSound,
  playBackButtonSound
} from '@/services/soundEffects';
import { NOTIFICATIONS_STRINGS } from '@/strings/notifications.strings';
import { NOTIFICATIONS_PAGE_SIZE } from '@/constants/pagination';
import { NOTIFICATION_KIND_CATEGORY } from '@shared/notificationEntry';
import type { NotificationsScreenProps } from '@/components/NotificationsScreen/NotificationsScreen.types';

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { entries, clear, markRead, markAllRead, remove } = useNotifications();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [kindFilter, setKindFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const availableKinds = useMemo(() => [...new Set(entries.map((entry) => entry.kind))], [entries]);
  const availableCategories = useMemo(() => [...new Set(entries.map((entry) => NOTIFICATION_KIND_CATEGORY[entry.kind]))], [entries]);

  const filteredEntries = entries.filter((entry) => {
    if (kindFilter.length > 0 && !kindFilter.includes(entry.kind)) return false;
    if (categoryFilter.length > 0 && !categoryFilter.includes(NOTIFICATION_KIND_CATEGORY[entry.kind])) return false;
    return true;
  });
  const sortedEntries = [...filteredEntries].reverse();
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
            <ActionButton
              variant="default"
              className="flex-shrink-0"
              onClick={() => {
                playMarkAllNotificationsReadSound();
                markAllRead();
              }}
            >
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

        <div className="flex gap-4 flex-wrap mb-4">
          <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
            {NOTIFICATIONS_STRINGS.typeFilterLabel}
            <select
              multiple
              className="bg-panel-2 border border-border rounded-lg px-2 py-1 min-w-[180px] text-body-sm"
              value={kindFilter}
              onChange={(event) => {
                playNotificationFilterToggleSound();
                setKindFilter(readSelectedValues(event));
              }}
            >
              {availableKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {NOTIFICATIONS_STRINGS.kindLabels[kind]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
            {NOTIFICATIONS_STRINGS.categoryFilterLabel}
            <select
              multiple
              className="bg-panel-2 border border-border rounded-lg px-2 py-1 min-w-[180px] text-body-sm"
              value={categoryFilter}
              onChange={(event) => {
                playNotificationFilterToggleSound();
                setCategoryFilter(readSelectedValues(event));
              }}
            >
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {NOTIFICATIONS_STRINGS.categoryLabels[category]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          {sortedEntries.length === 0 ? (
            <p className="text-text-dim text-body-sm">{NOTIFICATIONS_STRINGS.emptyMessage}</p>
          ) : (
            pageItems.map((entry) => <NotificationEntryRow key={entry.id} entry={entry} onRead={markRead} onDelete={remove} />)
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
