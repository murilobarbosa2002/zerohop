import type { CaptureSource } from '@shared/ipc-types';

export interface SourcePickerState {
  sources: CaptureSource[];
  selectedId: string | null;
  loading: boolean;
  select: (id: string) => void;
  refresh: () => Promise<CaptureSource[]>;
  setWatching: (watching: boolean) => void;
}
