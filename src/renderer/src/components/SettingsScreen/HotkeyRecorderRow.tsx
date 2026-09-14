import { useEffect, useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { keyboardEventToAccelerator } from '@/lib/keyboardAccelerator';
import { RECORD_HOTKEY_TIMEOUT_MS } from '@/constants/hotkeys';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { HotkeyBinding, AcceleratorBinding } from '@shared/hotkeySettings';

interface HotkeyRecorderRowProps<T extends { label: string }> {
  label: string;
  value: T | null;
  onChange: (value: T | null) => void;
  mode: 'accelerator' | 'globalKeycode';
  errorMessage?: string | null;
}

export function HotkeyRecorderRow<T extends HotkeyBinding | AcceleratorBinding>({
  label,
  value,
  onChange,
  mode,
  errorMessage
}: HotkeyRecorderRowProps<T>) {
  const [recording, setRecording] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!recording) return;

    if (mode === 'accelerator') {
      function handleKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        const binding = keyboardEventToAccelerator(event);
        if (!binding) return;
        setRecording(false);
        onChange(binding as T);
      }
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }

    const unsubscribe = window.api.onHotkeyRecorded((binding) => {
      setRecording(false);
      onChange(binding as T);
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
  }, [recording, onChange, mode]);

  function startRecording(): void {
    setTimedOut(false);
    setRecording(true);
    if (mode === 'globalKeycode') window.api.recordNextHotkey();
  }

  function stopRecording(): void {
    setRecording(false);
  }

  const failureMessage = timedOut ? SETTINGS_STRINGS.recordHotkeyTimeoutStatus : errorMessage;
  const statusLabel = recording
    ? SETTINGS_STRINGS.recordingHotkeyStatus
    : (failureMessage ?? value?.label ?? SETTINGS_STRINGS.noHotkeySetLabel);

  return (
    <div className="flex items-center gap-2 mt-2.5">
      <span className="text-body-sm w-form-column-wide flex-shrink-0">{label}</span>
      <span className={`text-xs flex-1 min-w-0 truncate ${!recording && failureMessage ? 'text-danger' : 'text-text-dim'}`}>
        {statusLabel}
      </span>
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
