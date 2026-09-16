import { useMemo, useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { CopyButton } from '@/components/CopyButton';
import { CheckboxFilterGroup } from '@/components/CheckboxFilterGroup';
import { LogEntryRow } from '@/components/LogsScreen/LogEntryRow';
import { ClearLogsConfirmation } from '@/components/LogsScreen/ClearLogsConfirmation';
import { Pagination } from '@/components/Pagination';
import { useAppLogs } from '@/hooks/useAppLogs';
import { usePagination } from '@/hooks/usePagination';
import { formatLogsAsText } from '@/lib/formatLogsAsText';
import { toggleArrayValue } from '@/lib/toggleArrayValue';
import {
  playLogsClearOpenSound,
  playLogsClearCancelSound,
  playLogsClearConfirmSound,
  playLogCategoryFilterClickSound,
  playLogLevelFilterToggleSound,
  playBackButtonSound
} from '@/services/soundEffects';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LOGS_PAGE_SIZE } from '@/constants/pagination';
import type { LogsScreenProps } from '@/components/LogsScreen/LogsScreen.types';

export function LogsScreen({ onBack }: LogsScreenProps) {
  const { entries, clear } = useAppLogs();
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<string[]>([]);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const availableCategories = useMemo(() => [...new Set(entries.map((entry) => entry.category))], [entries]);
  const availableLevels = useMemo(() => [...new Set(entries.map((entry) => entry.level))], [entries]);

  const filteredEntries = entries.filter((entry) => {
    if (categoryFilter.length > 0 && !categoryFilter.includes(entry.category)) return false;
    if (levelFilter.length > 0 && !levelFilter.includes(entry.level)) return false;
    return true;
  });
  const sortedEntries = [...filteredEntries].reverse();
  const { pageItems, page, totalPages, setPage } = usePagination(sortedEntries, LOGS_PAGE_SIZE);

  function handleClear(): void {
    clear();
    playLogsClearConfirmSound();
    setConfirmingClear(false);
  }

  function handleCancelClear(): void {
    playLogsClearCancelSound();
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
          {LOG_STRINGS.backButton}
        </button>
        <p className="font-bold text-body-sm-alt">{LOG_STRINGS.screenTitle}</p>
        <div className="ml-auto flex items-center gap-2">{entries.length > 0 && <CopyButton text={formatLogsAsText(entries)} />}</div>
        <ActionButton
          variant="default"
          className="flex-shrink-0"
          onClick={() => {
            playLogsClearOpenSound();
            setConfirmingClear(true);
          }}
        >
          {LOG_STRINGS.clearButton}
        </ActionButton>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {confirmingClear && (
          <div className="mb-4">
            <ClearLogsConfirmation onConfirm={handleClear} onCancel={handleCancelClear} />
          </div>
        )}

        <div className="flex gap-4 flex-wrap mb-4">
          <CheckboxFilterGroup
            label={LOG_STRINGS.typeFilterLabel}
            options={availableLevels.map((level) => ({ value: level, label: LOG_STRINGS.levelLabels[level] }))}
            selected={levelFilter}
            onToggle={(value) => {
              playLogLevelFilterToggleSound();
              setLevelFilter((current) => toggleArrayValue(current, value));
              setPage(1);
            }}
          />
          <CheckboxFilterGroup
            label={LOG_STRINGS.categoryFilterLabel}
            options={availableCategories.map((category) => ({ value: category, label: LOG_STRINGS.categoryLabels[category] }))}
            selected={categoryFilter}
            onToggle={(value) => {
              playLogCategoryFilterClickSound();
              setCategoryFilter((current) => toggleArrayValue(current, value));
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          {sortedEntries.length === 0 ? (
            <p className="text-text-dim text-body-sm">{LOG_STRINGS.emptyMessage}</p>
          ) : (
            pageItems.map((entry) => <LogEntryRow key={entry.id} entry={entry} />)
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
