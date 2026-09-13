import { useMemo } from 'react';
import { useMarkdownFile } from '@/hooks/useMarkdownFile';
import { usePagination } from '@/hooks/usePagination';
import { parseSimpleMarkdown } from '@/lib/simpleMarkdown';
import { MarkdownView } from '@/components/MarkdownView';
import { Pagination } from '@/components/Pagination';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import { CHANGELOG_PAGE_SIZE } from '@/constants/pagination';
import type { ChangelogIndexProps } from '@/components/UpdatesScreen/UpdatesScreen.types';

export function ChangelogIndex({ onOpenRelease }: ChangelogIndexProps) {
  const { content, loading, error } = useMarkdownFile('CHANGELOG.md');
  const blocks = useMemo(() => parseSimpleMarkdown(content), [content]);
  const tableBlock = blocks.find((block) => block.type === 'table');
  const rows = tableBlock?.type === 'table' ? tableBlock.rows : [];
  const { pageItems, page, totalPages, setPage } = usePagination(rows, CHANGELOG_PAGE_SIZE);

  const pagedBlocks = useMemo(
    () => blocks.map((block) => (block.type === 'table' ? { ...block, rows: pageItems } : block)),
    [blocks, pageItems]
  );

  return (
    <div className="max-w-modal">
      {loading && <p className="text-text-dim text-xs">{UPDATES_STRINGS.changelogLoading}</p>}
      {error && <p className="text-text-dim text-xs">{UPDATES_STRINGS.changelogError(error)}</p>}
      {!loading && !error && (
        <>
          <MarkdownView blocks={pagedBlocks} onInternalLink={onOpenRelease} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
