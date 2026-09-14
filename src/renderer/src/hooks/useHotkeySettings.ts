import { useEffect, useState } from 'react';
import type { HotkeySettings, ToggleHotkeyRegistrationResult } from '@shared/hotkeySettings';
import { DEFAULT_HOTKEY_SETTINGS } from '@/constants/hotkeys';

export function useHotkeySettings(): [HotkeySettings, (next: HotkeySettings) => Promise<ToggleHotkeyRegistrationResult>] {
  const [hotkeys, setHotkeysState] = useState<HotkeySettings>(DEFAULT_HOTKEY_SETTINGS);

  useEffect(() => {
    window.api.getHotkeySettings().then(setHotkeysState);
  }, []);

  async function setHotkeys(next: HotkeySettings): Promise<ToggleHotkeyRegistrationResult> {
    setHotkeysState(next);
    return window.api.setHotkeySettings(next);
  }

  return [hotkeys, setHotkeys];
}
