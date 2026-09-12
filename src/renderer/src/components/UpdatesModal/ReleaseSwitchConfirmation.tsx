import { ActionButton } from '@/components/ActionButton';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { ReleaseSwitchConfirmationProps } from '@/components/UpdatesModal/UpdatesModal.types';

export function ReleaseSwitchConfirmation({ release, onConfirm, onCancel }: ReleaseSwitchConfirmationProps) {
  return (
    <div>
      <p className="font-bold text-body-sm-alt">{UPDATES_STRINGS.switchVersionExplanationTitle(release.name)}</p>
      <p className="text-text-dim text-xs mt-2 leading-relaxed">{UPDATES_STRINGS.switchVersionExplanationBody}</p>
      <p className="text-text-dim text-xs mt-2 leading-relaxed">{UPDATES_STRINGS.switchVersionSameVersionHint}</p>
      <div className="flex gap-2 mt-3.5">
        <ActionButton variant="default" className="flex-1" onClick={onCancel}>
          {UPDATES_STRINGS.switchVersionCancelButton}
        </ActionButton>
        <ActionButton variant="primary" className="flex-1" onClick={onConfirm}>
          {UPDATES_STRINGS.switchVersionConfirmButton}
        </ActionButton>
      </div>
    </div>
  );
}
