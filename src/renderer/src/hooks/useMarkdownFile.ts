import { useEffect, useState } from 'react';
import { GITHUB_REPO_RAW_URL } from '@/constants/githubRepo';
import { errorMessage } from '@/lib/errorMessage';
import type { MarkdownFileState } from '@/hooks/useMarkdownFile.types';

export function useMarkdownFile(path: string | null): MarkdownFileState {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${GITHUB_REPO_RAW_URL}/${path}`)
      .then((response) => response.text())
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) setError(errorMessage(fetchError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { content, loading, error };
}
