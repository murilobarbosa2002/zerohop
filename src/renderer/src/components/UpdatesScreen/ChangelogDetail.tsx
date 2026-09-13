import { useMarkdownFile } from '@/hooks/useMarkdownFile';
import { parseSimpleMarkdown } from '@/lib/simpleMarkdown';
import { MarkdownView } from '@/components/MarkdownView';
import { playBackButtonSound } from '@/services/soundEffects';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { ChangelogDetailProps } from '@/components/UpdatesScreen/UpdatesScreen.types';

export function ChangelogDetail({ path, onBack }: ChangelogDetailProps) {
  const { content, loading, error } = useMarkdownFile(path);

  return (
    <div className="max-w-modal">
      <button
        onClick={() => {
          playBackButtonSound();
          onBack();
        }}
        className="text-accent text-body-sm hover:underline mb-3"
      >
        {UPDATES_STRINGS.backToChangelogButton}
      </button>
      {loading && <p className="text-text-dim text-xs">{UPDATES_STRINGS.changelogLoading}</p>}
      {error && <p className="text-text-dim text-xs">{UPDATES_STRINGS.changelogError(error)}</p>}
      {!loading && !error && <MarkdownView blocks={parseSimpleMarkdown(content)} />}
    </div>
  );
}
