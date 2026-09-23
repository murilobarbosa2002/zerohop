import { useMemo } from 'react';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { useMarkdownFile } from '@/hooks/useMarkdownFile';
import { parseSimpleMarkdown } from '@/lib/simpleMarkdown';
import { playOpenUpdatesTeaserSound } from '@/services/soundEffects';
import { HOME_STRINGS } from '@/strings/home.strings';
import type { HomeExtrasProps } from '@/components/PreRoom/HomeExtras/HomeExtras.types';

export function ChangelogTeaserPanel({ onOpenUpdates }: Pick<HomeExtrasProps, 'onOpenUpdates'>) {
  const { content, loading } = useMarkdownFile('CHANGELOG.md');
  const latestRow = useMemo(() => {
    const blocks = parseSimpleMarkdown(content);
    const tableBlock = blocks.find((block) => block.type === 'table');
    return tableBlock?.type === 'table' ? tableBlock.rows[0] : undefined;
  }, [content]);

  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{HOME_STRINGS.changelogTitle}</p>
      {loading ? (
        <p className="text-text-dim text-xs mt-1">{HOME_STRINGS.changelogLoading}</p>
      ) : (
        latestRow && (
          <p className="text-text-dim text-xs mt-1 leading-relaxed">
            {latestRow[0].replace(/\[|\]\(.*\)/g, '')} — {latestRow[1]}
          </p>
        )
      )}
      <ActionButton
        variant="default"
        className="mt-2.5 w-full text-body-xs"
        onClick={() => {
          playOpenUpdatesTeaserSound();
          onOpenUpdates();
        }}
      >
        {HOME_STRINGS.changelogSeeMoreButton}
      </ActionButton>
    </Card>
  );
}
