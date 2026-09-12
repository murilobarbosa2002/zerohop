import { ActionButton } from '@/components/ActionButton';
import { LOG_STRINGS } from '@/strings/logs.strings';
import type { ClearLogsConfirmationProps } from '@/components/LogsScreen/LogsScreen.types';

export function ClearLogsConfirmation({ onConfirm, onCancel }: ClearLogsConfirmationProps) {
  return (
    <div className="bg-panel-2 border border-border rounded-lg px-3 py-2.5 flex items-center gap-3 flex-wrap">
      <p className="text-body-sm flex-1">{LOG_STRINGS.clearConfirmMessage}</p>
      <div className="flex gap-2">
        <ActionButton variant="default" onClick={onCancel}>
          {LOG_STRINGS.clearCancelButton}
        </ActionButton>
        <ActionButton variant="danger" onClick={onConfirm}>
          {LOG_STRINGS.clearConfirmButton}
        </ActionButton>
      </div>
    </div>
  );
}
