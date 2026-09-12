import type { AppUpdaterState } from '@/hooks/useAppUpdater.types';
import type { ReleaseHistoryEntry } from '@/hooks/useReleaseHistory.types';

export interface UpdatesModalProps {
  open: boolean;
  onClose: () => void;
}

export type UpdateStatusPanelProps = AppUpdaterState;

export interface ReleaseHistoryPanelProps {
  currentVersion: string;
}

export interface ReleaseHistoryListProps {
  releases: ReleaseHistoryEntry[];
  currentVersion: string;
  onSelect: (release: ReleaseHistoryEntry) => void;
}

export interface ReleaseSwitchConfirmationProps {
  release: ReleaseHistoryEntry;
  onConfirm: () => void;
  onCancel: () => void;
}
