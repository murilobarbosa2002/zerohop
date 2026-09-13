import { RangeSlider } from '@/components/RangeSlider';
import { HotkeyRecorderRow } from '@/components/SettingsScreen/HotkeyRecorderRow';
import { useHotkeySettings } from '@/hooks/useHotkeySettings';
import {
  MIN_PUSH_TO_TALK_RELEASE_DELAY_MS,
  MAX_PUSH_TO_TALK_RELEASE_DELAY_MS,
  PUSH_TO_TALK_RELEASE_DELAY_STEP_MS
} from '@/constants/hotkeys';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { HotkeyBinding } from '@shared/hotkeySettings';

export function HotkeySettings() {
  const [hotkeys, setHotkeys] = useHotkeySettings();

  function updateBinding(key: 'micMuteHotkey' | 'deafenHotkey' | 'pushToTalkHotkey', value: HotkeyBinding | null): void {
    setHotkeys({ ...hotkeys, [key]: value });
  }

  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.hotkeysTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.hotkeysHint}</p>

      <HotkeyRecorderRow
        label={SETTINGS_STRINGS.micMuteHotkeyLabel}
        value={hotkeys.micMuteHotkey}
        onChange={(value) => updateBinding('micMuteHotkey', value)}
      />
      <HotkeyRecorderRow
        label={SETTINGS_STRINGS.deafenHotkeyLabel}
        value={hotkeys.deafenHotkey}
        onChange={(value) => updateBinding('deafenHotkey', value)}
      />
      <HotkeyRecorderRow
        label={SETTINGS_STRINGS.pushToTalkHotkeyLabel}
        value={hotkeys.pushToTalkHotkey}
        onChange={(value) => updateBinding('pushToTalkHotkey', value)}
      />

      <div className="mt-3.5">
        <p className="text-body-sm">{SETTINGS_STRINGS.pushToTalkReleaseDelayLabel}</p>
        <p className="text-text-dim text-xs mt-1 leading-relaxed">{SETTINGS_STRINGS.pushToTalkReleaseDelayHint}</p>
        <div className="flex items-center gap-2 mt-2">
          <RangeSlider
            min={MIN_PUSH_TO_TALK_RELEASE_DELAY_MS}
            max={MAX_PUSH_TO_TALK_RELEASE_DELAY_MS}
            step={PUSH_TO_TALK_RELEASE_DELAY_STEP_MS}
            value={hotkeys.pushToTalkReleaseDelayMs}
            onChange={(value) => setHotkeys({ ...hotkeys, pushToTalkReleaseDelayMs: value })}
          />
          <span className="text-text-dim text-xs w-14 text-right">{hotkeys.pushToTalkReleaseDelayMs}ms</span>
        </div>
      </div>
    </div>
  );
}
