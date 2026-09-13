import { app } from 'electron';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  SETTINGS_FILE_NAME,
  DEFAULT_AUTO_UPDATE_ENABLED,
  DEFAULT_EXPERIMENTAL_WGC_CAPTURE_ENABLED,
  DEFAULT_EXPERIMENTAL_PER_APP_AUDIO_ENABLED
} from '@main/constants/settings';
import { DEFAULT_PUSH_TO_TALK_RELEASE_DELAY_MS } from '@shared/hotkeySettings';
import type { HotkeyBinding, HotkeySettings } from '@shared/hotkeySettings';

interface AppSettings {
  autoUpdateEnabled: boolean;
  experimentalWgcCaptureEnabled: boolean;
  experimentalPerAppAudioEnabled: boolean;
  hotkeys: HotkeySettings;
}

function parseHotkeyBinding(value: unknown): HotkeyBinding | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.keycode !== 'number' || typeof candidate.label !== 'string') return null;
  return { keycode: candidate.keycode, label: candidate.label };
}

function parseHotkeys(value: unknown): HotkeySettings {
  const parsed = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  return {
    micMuteHotkey: parseHotkeyBinding(parsed.micMuteHotkey),
    deafenHotkey: parseHotkeyBinding(parsed.deafenHotkey),
    pushToTalkHotkey: parseHotkeyBinding(parsed.pushToTalkHotkey),
    pushToTalkReleaseDelayMs:
      typeof parsed.pushToTalkReleaseDelayMs === 'number' ? parsed.pushToTalkReleaseDelayMs : DEFAULT_PUSH_TO_TALK_RELEASE_DELAY_MS
  };
}

function getSettingsFilePath(): string {
  return join(app.getPath('userData'), SETTINGS_FILE_NAME);
}

function defaultHotkeys(): HotkeySettings {
  return {
    micMuteHotkey: null,
    deafenHotkey: null,
    pushToTalkHotkey: null,
    pushToTalkReleaseDelayMs: DEFAULT_PUSH_TO_TALK_RELEASE_DELAY_MS
  };
}

export function getSettings(): AppSettings {
  try {
    const raw = readFileSync(getSettingsFilePath(), 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      autoUpdateEnabled: typeof parsed.autoUpdateEnabled === 'boolean' ? parsed.autoUpdateEnabled : DEFAULT_AUTO_UPDATE_ENABLED,
      experimentalWgcCaptureEnabled:
        typeof parsed.experimentalWgcCaptureEnabled === 'boolean'
          ? parsed.experimentalWgcCaptureEnabled
          : DEFAULT_EXPERIMENTAL_WGC_CAPTURE_ENABLED,
      experimentalPerAppAudioEnabled:
        typeof parsed.experimentalPerAppAudioEnabled === 'boolean'
          ? parsed.experimentalPerAppAudioEnabled
          : DEFAULT_EXPERIMENTAL_PER_APP_AUDIO_ENABLED,
      hotkeys: parseHotkeys(parsed.hotkeys)
    };
  } catch {
    return {
      autoUpdateEnabled: DEFAULT_AUTO_UPDATE_ENABLED,
      experimentalWgcCaptureEnabled: DEFAULT_EXPERIMENTAL_WGC_CAPTURE_ENABLED,
      experimentalPerAppAudioEnabled: DEFAULT_EXPERIMENTAL_PER_APP_AUDIO_ENABLED,
      hotkeys: defaultHotkeys()
    };
  }
}

export function setAutoUpdateEnabled(value: boolean): void {
  const settings = getSettings();
  settings.autoUpdateEnabled = value;
  writeFileSync(getSettingsFilePath(), JSON.stringify(settings), 'utf-8');
}

export function setHotkeySettings(hotkeys: HotkeySettings): void {
  const settings = getSettings();
  settings.hotkeys = hotkeys;
  writeFileSync(getSettingsFilePath(), JSON.stringify(settings), 'utf-8');
}

export function ensureSettingsFileExists(): void {
  const path = getSettingsFilePath();
  if (existsSync(path)) return;
  writeFileSync(path, JSON.stringify(getSettings()), 'utf-8');
}
