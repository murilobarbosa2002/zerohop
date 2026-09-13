export const DEFAULT_PUSH_TO_TALK_RELEASE_DELAY_MS = 150;

export interface HotkeyBinding {
  keycode: number;
  label: string;
}

export interface HotkeySettings {
  micMuteHotkey: HotkeyBinding | null;
  deafenHotkey: HotkeyBinding | null;
  pushToTalkHotkey: HotkeyBinding | null;
  pushToTalkReleaseDelayMs: number;
}

export type HotkeyAction = 'micMuteHotkey' | 'deafenHotkey' | 'pushToTalkHotkey';
