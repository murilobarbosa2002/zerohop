import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { ReleaseHistoryListProps } from '@/components/UpdatesScreen/UpdatesScreen.types';

export function ReleaseHistoryList({ releases, currentVersion, onSelect }: ReleaseHistoryListProps) {
  return (
    <div className="flex flex-col gap-2 max-w-modal">
      {releases.map((release) => {
        const isCurrent = release.tagName === `v${currentVersion}`;
        return (
          <div
            key={release.tagName}
            className="flex items-center justify-between gap-2 bg-panel-2 border border-border rounded-lg px-4 py-3"
          >
            <span className="text-body-sm flex items-center gap-2">
              {release.name}
              {isCurrent && (
                <span className="text-badge-xs font-bold text-success bg-success/15 rounded-full px-2 py-0.5">
                  {UPDATES_STRINGS.versionCurrentBadge}
                </span>
              )}
            </span>
            <button
              onClick={() => onSelect(release)}
              className="text-badge-xs font-bold text-accent bg-accent-soft rounded-full px-2.5 py-1 hover:brightness-110 flex-shrink-0"
            >
              {UPDATES_STRINGS.openDownloadPageButton}
            </button>
          </div>
        );
      })}
    </div>
  );
}
