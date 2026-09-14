export const DEFAULT_PUSH_TO_TALK_RELEASE_DELAY_MS = 150;

export interface HotkeyBinding {
  keycode: number;
  label: string;
}

export interface AcceleratorBinding {
  accelerator: string;
  label: string;
}

export interface HotkeySettings {
  micMuteHotkey: AcceleratorBinding | null;
  deafenHotkey: AcceleratorBinding | null;
  pushToTalkHotkey: HotkeyBinding | null;
  pushToTalkReleaseDelayMs: number;
}

export type HotkeyAction = 'micMuteHotkey' | 'deafenHotkey' | 'pushToTalkHotkey';

export interface ToggleHotkeyRegistrationResult {
  micMuteFailed: boolean;
  deafenFailed: boolean;
}
