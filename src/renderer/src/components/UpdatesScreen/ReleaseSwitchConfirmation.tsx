import { ActionButton } from '@/components/ActionButton';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { ReleaseSwitchConfirmationProps } from '@/components/UpdatesScreen/UpdatesScreen.types';

export function ReleaseSwitchConfirmation({ release, onConfirm, onCancel }: ReleaseSwitchConfirmationProps) {
  return (
    <div className="max-w-modal">
      <p className="font-bold text-lg">{UPDATES_STRINGS.switchVersionExplanationTitle(release.name)}</p>
      <p className="text-text-dim text-body-sm mt-3 leading-relaxed">{UPDATES_STRINGS.switchVersionExplanationBody}</p>
      <p className="text-text-dim text-body-sm mt-3 leading-relaxed">{UPDATES_STRINGS.switchVersionSameVersionHint}</p>
      <div className="flex gap-2 mt-5">
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
