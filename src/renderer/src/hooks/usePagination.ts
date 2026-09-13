import { useEffect, useMemo, useState } from 'react';

export interface PaginationResult<T> {
  pageItems: T[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export function usePagination<T>(items: T[], pageSize: number): PaginationResult<T> {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { pageItems, page: Math.min(page, totalPages), totalPages, setPage };
}
