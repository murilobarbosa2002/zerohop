import { useEffect, useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { keyboardEventToAccelerator } from '@/lib/keyboardAccelerator';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { AcceleratorBinding } from '@shared/hotkeySettings';

interface HotkeyRecorderRowProps {
  label: string;
  value: AcceleratorBinding | null;
  onChange: (value: AcceleratorBinding | null) => void;
  errorMessage?: string | null;
}

export function HotkeyRecorderRow({ label, value, onChange, errorMessage }: HotkeyRecorderRowProps) {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!recording) return;

    function handleKeyDown(event: KeyboardEvent): void {
      event.preventDefault();
      const binding = keyboardEventToAccelerator(event);
      if (!binding) return;
      setRecording(false);
      onChange(binding);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recording, onChange]);

  function startRecording(): void {
    setRecording(true);
  }

  function stopRecording(): void {
    setRecording(false);
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
    </div>
  );
}
