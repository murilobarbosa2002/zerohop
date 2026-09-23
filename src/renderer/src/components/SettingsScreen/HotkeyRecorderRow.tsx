import { useEffect, useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { keyboardEventToAccelerator } from '@/lib/keyboardAccelerator';
import {
  playRecordHotkeyClickSound,
  playRemoveHotkeyClickSound,
  playHotkeyKeyRecognizedSound,
  playHotkeyConfirmClickSound,
  playHotkeyCancelClickSound
} from '@/services/soundEffects';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { AcceleratorBinding } from '@shared/hotkeySettings';

interface HotkeyRecorderRowProps {
  label: string;
  value: AcceleratorBinding | null;
  onChange: (value: AcceleratorBinding | null) => void;
  errorMessage?: string | null;
  checkConflict?: (binding: AcceleratorBinding) => string | null;
}

export function HotkeyRecorderRow({ label, value, onChange, errorMessage, checkConflict }: HotkeyRecorderRowProps) {
  const [recording, setRecording] = useState(false);
  const [pendingBinding, setPendingBinding] = useState<AcceleratorBinding | null>(null);

  useEffect(() => {
    if (!recording) return;

    function handleKeyDown(event: KeyboardEvent): void {
      event.preventDefault();
      const binding = keyboardEventToAccelerator(event);
      if (!binding) return;
      playHotkeyKeyRecognizedSound();
      setRecording(false);
      setPendingBinding(binding);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recording]);

  function startRecording(): void {
    playRecordHotkeyClickSound();
    setRecording(true);
  }

  function stopRecording(): void {
    setRecording(false);
  }

  function handleConfirm(): void {
    if (!pendingBinding) return;
    playHotkeyConfirmClickSound();
    onChange(pendingBinding);
    setPendingBinding(null);
  }

  function handleCancel(): void {
    playHotkeyCancelClickSound();
    setPendingBinding(null);
  }

  if (pendingBinding) {
    const conflictLabel = checkConflict?.(pendingBinding) ?? null;
    return (
      <div className="mt-3 bg-panel-2 border border-border rounded-lg px-3 py-2.5">
        <p className="text-body-sm">{label}</p>
        <p className="text-body-sm-alt font-bold mt-1">{SETTINGS_STRINGS.hotkeyRecognizedTitle(pendingBinding.label)}</p>
        {conflictLabel && <p className="text-warn text-xs mt-1">{SETTINGS_STRINGS.hotkeyRecognizedConflictHint(conflictLabel)}</p>}
        <div className="flex gap-2 mt-2.5">
          <ActionButton variant="default" size="compact" className="flex-1" onClick={handleCancel}>
            {SETTINGS_STRINGS.hotkeyCancelButton}
          </ActionButton>
          <ActionButton variant="primary" size="compact" className="flex-1" onClick={handleConfirm}>
            {SETTINGS_STRINGS.hotkeyConfirmButton}
          </ActionButton>
        </div>
      </div>
    );
  }

  const statusLabel = recording
    ? SETTINGS_STRINGS.recordingHotkeyStatus
    : (errorMessage ?? value?.label ?? SETTINGS_STRINGS.noHotkeySetLabel);

  return (
    <div className="mt-3">
      <p className="text-body-sm">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-xs flex-1 min-w-0 break-words ${!recording && errorMessage ? 'text-danger' : 'text-text-dim'}`}>
          {statusLabel}
        </span>
        {recording ? (
          <ActionButton variant="default" size="compact" className="flex-shrink-0" onClick={stopRecording}>
            {SETTINGS_STRINGS.cancelRecordingHotkeyButton}
          </ActionButton>
        ) : (
          <>
            <ActionButton variant="default" size="compact" className="flex-shrink-0" onClick={startRecording}>
              {SETTINGS_STRINGS.recordHotkeyButton}
            </ActionButton>
            {value && (
              <ActionButton
                variant="danger"
                size="compact"
                className="flex-shrink-0"
                onClick={() => {
                  playRemoveHotkeyClickSound();
                  onChange(null);
                }}
              >
                {SETTINGS_STRINGS.clearHotkeyButton}
              </ActionButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
