import { MarkdownInlineText } from '@/components/MarkdownView/MarkdownInlineText';
import { MarkdownTable } from '@/components/MarkdownView/MarkdownTable';
import { headingVariants } from '@/components/MarkdownView/MarkdownView.variants';
import type { MarkdownViewProps } from '@/components/MarkdownView/MarkdownView.types';

export function MarkdownView({ blocks, onInternalLink }: MarkdownViewProps) {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const HeadingTag = `h${block.level}` as const;
          return (
            <HeadingTag key={index} className={headingVariants({ level: block.level })}>
              {block.text}
            </HeadingTag>
          );
        }
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="text-body-sm text-text-dim leading-relaxed">
              <MarkdownInlineText text={block.text} onInternalLink={onInternalLink} />
            </p>
          );
        }
        return <MarkdownTable key={index} headers={block.headers} rows={block.rows} onInternalLink={onInternalLink} />;
      })}
    </div>
  );
}
