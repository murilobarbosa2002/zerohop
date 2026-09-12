import type { LogCategory, LogEntry } from '@shared/logEntry';

export interface LogsScreenProps {
  onBack: () => void;
}

export interface LogEntryRowProps {
  entry: LogEntry;
}

export interface ClearLogsConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export interface CategoryFilterProps {
  selected: LogCategory | null;
  onSelect: (category: LogCategory | null) => void;
}
