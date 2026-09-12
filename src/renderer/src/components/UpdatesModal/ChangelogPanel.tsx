import { useChangelog } from '@/hooks/useChangelog';
import { UPDATES_STRINGS } from '@/strings/updates.strings';

export function ChangelogPanel() {
  const { content, loading, error } = useChangelog(true);

  return (
    <div className="max-h-source-list overflow-y-auto">
      {loading && <p className="text-text-dim text-xs">{UPDATES_STRINGS.changelogLoading}</p>}
      {error && <p className="text-text-dim text-xs">{UPDATES_STRINGS.changelogError(error)}</p>}
      {!loading && !error && <pre className="text-xs text-text-dim whitespace-pre-wrap font-mono">{content}</pre>}
    </div>
  );
}
