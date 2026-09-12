import { useMarkdownFile } from '@/hooks/useMarkdownFile';
import { parseSimpleMarkdown } from '@/lib/simpleMarkdown';
import { MarkdownView } from '@/components/MarkdownView';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { ChangelogIndexProps } from '@/components/UpdatesScreen/UpdatesScreen.types';

export function ChangelogIndex({ onOpenRelease }: ChangelogIndexProps) {
  const { content, loading, error } = useMarkdownFile('CHANGELOG.md');

  return (
    <div className="max-w-modal">
      {loading && <p className="text-text-dim text-xs">{UPDATES_STRINGS.changelogLoading}</p>}
      {error && <p className="text-text-dim text-xs">{UPDATES_STRINGS.changelogError(error)}</p>}
      {!loading && !error && <MarkdownView blocks={parseSimpleMarkdown(content)} onInternalLink={onOpenRelease} />}
    </div>
  );
}
