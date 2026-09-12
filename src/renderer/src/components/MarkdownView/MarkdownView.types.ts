import type { MarkdownBlock } from '@/lib/simpleMarkdown';

export interface MarkdownViewProps {
  blocks: MarkdownBlock[];
  onInternalLink?: (path: string) => void;
}

export interface MarkdownInlineTextProps {
  text: string;
  onInternalLink?: (path: string) => void;
}

export interface MarkdownTableProps {
  headers: string[];
  rows: string[][];
  onInternalLink?: (path: string) => void;
}
