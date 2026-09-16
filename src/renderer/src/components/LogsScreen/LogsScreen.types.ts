import type { LogEntry } from '@shared/logEntry';

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
