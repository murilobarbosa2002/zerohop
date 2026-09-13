import { useState } from 'react';
import { useReleaseHistory } from '@/hooks/useReleaseHistory';
import { usePagination } from '@/hooks/usePagination';
import { ReleaseHistoryList } from '@/components/UpdatesScreen/ReleaseHistoryList';
import { ReleaseSwitchConfirmation } from '@/components/UpdatesScreen/ReleaseSwitchConfirmation';
import { Pagination } from '@/components/Pagination';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import { RELEASE_HISTORY_PAGE_SIZE } from '@/constants/pagination';
import type { ReleaseHistoryEntry } from '@/hooks/useReleaseHistory.types';
import type { ReleaseHistoryPanelProps } from '@/components/UpdatesScreen/UpdatesScreen.types';

export function ReleaseHistoryPanel({ currentVersion }: ReleaseHistoryPanelProps) {
  const { releases, loading, error } = useReleaseHistory(true);
  const [pendingRelease, setPendingRelease] = useState<ReleaseHistoryEntry | null>(null);
  const { pageItems, page, totalPages, setPage } = usePagination(releases, RELEASE_HISTORY_PAGE_SIZE);

  return pendingRelease ? (
    <ReleaseSwitchConfirmation
      release={pendingRelease}
      onCancel={() => setPendingRelease(null)}
      onConfirm={() => {
        window.api.openExternalUrl(pendingRelease.htmlUrl);
        setPendingRelease(null);
      }}
    />
  ) : (
    <div>
      {loading && <p className="text-text-dim text-xs">{UPDATES_STRINGS.versionsLoading}</p>}
      {error && <p className="text-text-dim text-xs">{UPDATES_STRINGS.versionsError(error)}</p>}
      {!loading && !error && (
        <>
          <ReleaseHistoryList releases={pageItems} currentVersion={currentVersion} onSelect={setPendingRelease} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
