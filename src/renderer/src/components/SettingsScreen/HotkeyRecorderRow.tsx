import { useEffect, useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { RECORD_HOTKEY_TIMEOUT_MS } from '@/constants/hotkeys';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { HotkeyBinding } from '@shared/hotkeySettings';

interface HotkeyRecorderRowProps {
  label: string;
  value: HotkeyBinding | null;
  onChange: (value: HotkeyBinding | null) => void;
}

export function HotkeyRecorderRow({ label, value, onChange }: HotkeyRecorderRowProps) {
  const [recording, setRecording] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const unsubscribe = window.api.onHotkeyRecorded((binding) => {
      setRecording(false);
      onChange(binding);
    });
    const timeout = setTimeout(() => {
      setRecording(false);
      setTimedOut(true);
    }, RECORD_HOTKEY_TIMEOUT_MS);
    return () => {
      unsubscribe();
      clearTimeout(timeout);
      window.api.cancelRecordHotkey();
    };
  }, [recording, onChange]);

  function startRecording(): void {
    setTimedOut(false);
    setRecording(true);
    window.api.recordNextHotkey();
  }

  function stopRecording(): void {
    setRecording(false);
  }

  const statusLabel = recording
    ? SETTINGS_STRINGS.recordingHotkeyStatus
    : timedOut
      ? SETTINGS_STRINGS.recordHotkeyTimeoutStatus
      : (value?.label ?? SETTINGS_STRINGS.noHotkeySetLabel);

  return (
    <div className="flex items-center gap-2 mt-2.5">
      <span className="text-body-sm w-form-column-wide flex-shrink-0">{label}</span>
      <span className="text-text-dim text-xs flex-1 min-w-0 truncate">{statusLabel}</span>
      {recording ? (
        <ActionButton variant="default" className="flex-shrink-0" onClick={stopRecording}>
          {SETTINGS_STRINGS.cancelRecordingHotkeyButton}
        </ActionButton>
      ) : (
        <>
          <ActionButton variant="default" className="flex-shrink-0" onClick={startRecording}>
            {SETTINGS_STRINGS.recordHotkeyButton}
          </ActionButton>
          {value && (
            <ActionButton variant="danger" className="flex-shrink-0" onClick={() => onChange(null)}>
              {SETTINGS_STRINGS.clearHotkeyButton}
            </ActionButton>
          )}
        </>
      )}
    </div>
  );
}
