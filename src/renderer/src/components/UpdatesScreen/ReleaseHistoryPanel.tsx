import { useState } from 'react';
import { useReleaseHistory } from '@/hooks/useReleaseHistory';
import { ReleaseHistoryList } from '@/components/UpdatesScreen/ReleaseHistoryList';
import { ReleaseSwitchConfirmation } from '@/components/UpdatesScreen/ReleaseSwitchConfirmation';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { ReleaseHistoryEntry } from '@/hooks/useReleaseHistory.types';
import type { ReleaseHistoryPanelProps } from '@/components/UpdatesScreen/UpdatesScreen.types';

export function ReleaseHistoryPanel({ currentVersion }: ReleaseHistoryPanelProps) {
  const { releases, loading, error } = useReleaseHistory(true);
  const [pendingRelease, setPendingRelease] = useState<ReleaseHistoryEntry | null>(null);

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
      {!loading && !error && <ReleaseHistoryList releases={releases} currentVersion={currentVersion} onSelect={setPendingRelease} />}
    </div>
  );
}
