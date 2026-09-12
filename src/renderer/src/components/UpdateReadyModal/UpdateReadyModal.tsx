import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { UpdateReadyModalProps } from '@/components/UpdateReadyModal/UpdateReadyModal.types';

export function UpdateReadyModal({ version, onInstall, onDismiss }: UpdateReadyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4">
      <div className="w-full max-w-modal">
        <Card>
          <p className="font-bold text-body-sm-alt">{UPDATES_STRINGS.updateReadyTitle}</p>
          <p className="text-text-dim text-xs mt-1.5">{UPDATES_STRINGS.updateReadyBody(version)}</p>
          <div className="flex gap-2 mt-3.5">
            <ActionButton variant="default" className="flex-1" onClick={onDismiss}>
              {UPDATES_STRINGS.updateReadyLaterButton}
            </ActionButton>
            <ActionButton variant="primary" className="flex-1" onClick={onInstall}>
              {UPDATES_STRINGS.updateReadyInstallButton}
            </ActionButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
