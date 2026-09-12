import { ActionButton } from '@/components/ActionButton';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { UpdateStatusPanelProps } from '@/components/UpdatesModal/UpdatesModal.types';

function statusMessage(status: UpdateStatusPanelProps['status']): string {
  if (!status) return '';
  switch (status.type) {
    case 'checking':
      return UPDATES_STRINGS.statusChecking;
    case 'available':
      return UPDATES_STRINGS.statusAvailable(status.version);
    case 'not-available':
      return UPDATES_STRINGS.statusNotAvailable;
    case 'downloading':
      return UPDATES_STRINGS.statusDownloading(status.percent);
    case 'downloaded':
      return UPDATES_STRINGS.statusDownloaded(status.version);
    case 'error':
      return UPDATES_STRINGS.statusError(status.message);
  }
}

export function UpdateStatusPanel({
  version,
  isPackaged,
  autoUpdateEnabled,
  status,
  checkForUpdates,
  installUpdate,
  setAutoUpdateEnabled
}: UpdateStatusPanelProps) {
  return (
    <div>
      <p className="font-bold text-body-sm-alt">{UPDATES_STRINGS.currentVersionLabel(version)}</p>

      <label className="flex items-center gap-2 text-body-sm mt-3">
        <input
          type="checkbox"
          checked={autoUpdateEnabled}
          disabled={!isPackaged}
          onChange={(event) => setAutoUpdateEnabled(event.target.checked)}
        />
        {UPDATES_STRINGS.autoUpdateToggleLabel}
      </label>
      <p className="text-text-dim text-xs mt-1.5">{UPDATES_STRINGS.autoUpdateToggleHint}</p>

      {!isPackaged && <p className="text-text-dim text-xs mt-1.5">{UPDATES_STRINGS.devModeHint}</p>}

      {isPackaged && (
        <>
          <ActionButton variant="primary" className="mt-3" onClick={checkForUpdates}>
            {UPDATES_STRINGS.checkButton}
          </ActionButton>

          {status?.type === 'downloading' && (
            <div className="w-full h-1.5 bg-panel-2 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-accent transition-all" style={{ width: `${status.percent}%` }} />
            </div>
          )}

          {status && <p className="text-text-dim text-xs mt-2.5">{statusMessage(status)}</p>}

          {status?.type === 'downloaded' && (
            <ActionButton variant="danger" className="mt-2.5" onClick={installUpdate}>
              {UPDATES_STRINGS.installButton}
            </ActionButton>
          )}
        </>
      )}
    </div>
  );
}
