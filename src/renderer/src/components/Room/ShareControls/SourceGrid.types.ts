import type { CaptureSource } from '@shared/ipc-types';

export interface SourceGridProps {
  sources: CaptureSource[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
