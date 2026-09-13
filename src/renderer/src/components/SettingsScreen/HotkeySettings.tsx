import { RangeSlider } from '@/components/RangeSlider';
import { HotkeyRecorderRow } from '@/components/SettingsScreen/HotkeyRecorderRow';
import { useHotkeySettings } from '@/hooks/useHotkeySettings';
import {
  MIN_PUSH_TO_TALK_RELEASE_DELAY_MS,
  MAX_PUSH_TO_TALK_RELEASE_DELAY_MS,
  PUSH_TO_TALK_RELEASE_DELAY_STEP_MS
} from '@/constants/hotkeys';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { AcceleratorBinding, HotkeyBinding } from '@shared/hotkeySettings';

export function HotkeySettings() {
  const [hotkeys, setHotkeys] = useHotkeySettings();

  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.hotkeysTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.hotkeysHint}</p>

      <HotkeyRecorderRow<AcceleratorBinding>
        mode="accelerator"
        label={SETTINGS_STRINGS.micMuteHotkeyLabel}
        value={hotkeys.micMuteHotkey}
        onChange={(value) => setHotkeys({ ...hotkeys, micMuteHotkey: value })}
      />
      <HotkeyRecorderRow<AcceleratorBinding>
        mode="accelerator"
        label={SETTINGS_STRINGS.deafenHotkeyLabel}
        value={hotkeys.deafenHotkey}
        onChange={(value) => setHotkeys({ ...hotkeys, deafenHotkey: value })}
      />
      <HotkeyRecorderRow<HotkeyBinding>
        mode="globalKeycode"
        label={SETTINGS_STRINGS.pushToTalkHotkeyLabel}
        value={hotkeys.pushToTalkHotkey}
        onChange={(value) => setHotkeys({ ...hotkeys, pushToTalkHotkey: value })}
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
