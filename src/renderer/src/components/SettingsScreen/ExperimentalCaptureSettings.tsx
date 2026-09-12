import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { useExperimentalCapture } from '@/hooks/useExperimentalCapture';
import { logEvent } from '@/services/appLog';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';

export function ExperimentalCaptureSettings() {
  const [enabled, setEnabled] = useExperimentalCapture();
  const [confirming, setConfirming] = useState(false);

  function handleToggle(checked: boolean): void {
    if (!checked) {
      setEnabled(false);
      logEvent(LogCategory.SHARING, LogLevel.WARNING, SETTINGS_STRINGS.experimentalDisabledLogMessage);
      return;
    }
    setConfirming(true);
  }

  function handleConfirm(): void {
    setEnabled(true);
    logEvent(LogCategory.SHARING, LogLevel.WARNING, SETTINGS_STRINGS.experimentalEnabledLogMessage);
    setConfirming(false);
  }

  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.experimentalTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.experimentalHint}</p>

      <label className="flex items-center gap-2 text-body-sm mt-3.5">
        <input type="checkbox" checked={enabled} onChange={(event) => handleToggle(event.target.checked)} />
        {SETTINGS_STRINGS.experimentalToggleLabel}
      </label>
      <p className="text-text-dim text-xs mt-1.5">{SETTINGS_STRINGS.experimentalRestartHint}</p>

      {confirming && (
        <div className="bg-panel-2 border border-warn rounded-lg px-3 py-2.5 mt-3">
          <p className="font-bold text-body-sm">{SETTINGS_STRINGS.experimentalConfirmTitle}</p>
          <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.experimentalConfirmBody}</p>
          <div className="flex gap-2 mt-3">
            <ActionButton variant="default" className="flex-1" onClick={() => setConfirming(false)}>
              {SETTINGS_STRINGS.experimentalCancelButton}
            </ActionButton>
            <ActionButton variant="danger" className="flex-1" onClick={handleConfirm}>
              {SETTINGS_STRINGS.experimentalConfirmButton}
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}
