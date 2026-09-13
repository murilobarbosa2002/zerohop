import { useEffect, useState } from 'react';
import type { HotkeySettings } from '@shared/hotkeySettings';
import { DEFAULT_HOTKEY_SETTINGS } from '@/constants/hotkeys';

export function useHotkeySettings(): [HotkeySettings, (next: HotkeySettings) => void] {
  const [hotkeys, setHotkeysState] = useState<HotkeySettings>(DEFAULT_HOTKEY_SETTINGS);

  useEffect(() => {
    window.api.getHotkeySettings().then(setHotkeysState);
  }, []);

  function setHotkeys(next: HotkeySettings): void {
    setHotkeysState(next);
    window.api.setHotkeySettings(next);
  }

  return [hotkeys, setHotkeys];
}
