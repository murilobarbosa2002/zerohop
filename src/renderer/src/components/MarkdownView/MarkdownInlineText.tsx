import type { MarkdownInlineTextProps } from '@/components/MarkdownView/MarkdownView.types';

const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export function MarkdownInlineText({ text, onInternalLink }: MarkdownInlineTextProps) {
  const parts: (string | { label: string; url: string })[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(MARKDOWN_LINK_PATTERN)) {
    const [fullMatch, label, url] = match;
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) parts.push(text.slice(lastIndex, matchIndex));
    parts.push({ label, url });
    lastIndex = matchIndex + fullMatch.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <>
      {parts.map((part, index) =>
        typeof part === 'string' ? (
          <span key={index}>{part}</span>
        ) : (
          <button
            key={index}
            onClick={() => (part.url.startsWith('http') ? window.api.openExternalUrl(part.url) : onInternalLink?.(part.url))}
            className="text-accent hover:underline"
          >
            {part.label}
          </button>
        )
      )}
    </>
  );
}
