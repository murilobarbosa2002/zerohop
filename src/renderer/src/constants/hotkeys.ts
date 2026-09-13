import { DEFAULT_PUSH_TO_TALK_RELEASE_DELAY_MS } from '@shared/hotkeySettings';
import type { HotkeySettings } from '@shared/hotkeySettings';

export const DEFAULT_HOTKEY_SETTINGS: HotkeySettings = {
  micMuteHotkey: null,
  deafenHotkey: null,
  pushToTalkHotkey: null,
  pushToTalkReleaseDelayMs: DEFAULT_PUSH_TO_TALK_RELEASE_DELAY_MS
};

export const MIN_PUSH_TO_TALK_RELEASE_DELAY_MS = 0;
export const MAX_PUSH_TO_TALK_RELEASE_DELAY_MS = 2000;
export const PUSH_TO_TALK_RELEASE_DELAY_STEP_MS = 50;
