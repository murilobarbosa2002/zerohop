import { COMMON_STRINGS } from '@/strings/common.strings';
import type { PaginationProps } from '@/components/Pagination/Pagination.types';

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-2 mt-3">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {COMMON_STRINGS.paginationPreviousButton}
      </button>
      <span className="text-text-dim text-xs">{COMMON_STRINGS.paginationPageLabel(page, totalPages)}</span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {COMMON_STRINGS.paginationNextButton}
      </button>
    </div>
  );
}
