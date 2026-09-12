import { useEffect, useState } from 'react';
import { GITHUB_REPO_API_URL } from '@/constants/githubRepo';
import { errorMessage } from '@/lib/errorMessage';
import type { ReleaseHistoryEntry, ReleaseHistoryState } from '@/hooks/useReleaseHistory.types';

interface GitHubReleaseResponse {
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
}

export function useReleaseHistory(enabled: boolean): ReleaseHistoryState {
  const [releases, setReleases] = useState<ReleaseHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${GITHUB_REPO_API_URL}/releases`)
      .then((response) => response.json())
      .then((data: GitHubReleaseResponse[]) => {
        if (cancelled) return;
        setReleases(
          data.map((release) => ({
            tagName: release.tag_name,
            name: release.name || release.tag_name,
            publishedAt: release.published_at,
            htmlUrl: release.html_url
          }))
        );
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

  return { releases, loading, error };
}
