import { useEffect, useState } from 'react';
import { GITHUB_REPO_RAW_URL } from '@/constants/githubRepo';
import { errorMessage } from '@/lib/errorMessage';
import type { ChangelogState } from '@/hooks/useChangelog.types';

export function useChangelog(enabled: boolean): ChangelogState {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${GITHUB_REPO_RAW_URL}/CHANGELOG.md`)
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
  }, [enabled]);

  return { content, loading, error };
}
