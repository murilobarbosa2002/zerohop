import { MarkdownInlineText } from '@/components/MarkdownView/MarkdownInlineText';
import type { MarkdownTableProps } from '@/components/MarkdownView/MarkdownView.types';

export function MarkdownTable({ headers, rows, onInternalLink }: MarkdownTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border">
            {headers.map((header, index) => (
              <th key={index} className="py-2 pr-4 text-body-xs text-text-dim font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2.5 pr-4 text-body-sm align-top">
                  <MarkdownInlineText text={cell} onInternalLink={onInternalLink} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
