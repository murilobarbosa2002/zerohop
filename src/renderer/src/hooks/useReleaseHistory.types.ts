export interface ReleaseHistoryEntry {
  tagName: string;
  name: string;
  publishedAt: string;
  htmlUrl: string;
}

export interface ReleaseHistoryState {
  releases: ReleaseHistoryEntry[];
  loading: boolean;
  error: string | null;
}
