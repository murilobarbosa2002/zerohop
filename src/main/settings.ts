import { app } from 'electron';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  SETTINGS_FILE_NAME,
  DEFAULT_AUTO_UPDATE_ENABLED,
  DEFAULT_EXPERIMENTAL_WGC_CAPTURE_ENABLED,
  DEFAULT_EXPERIMENTAL_PER_APP_AUDIO_ENABLED
} from '@main/constants/settings';

interface AppSettings {
  autoUpdateEnabled: boolean;
  experimentalWgcCaptureEnabled: boolean;
  experimentalPerAppAudioEnabled: boolean;
}

function getSettingsFilePath(): string {
  return join(app.getPath('userData'), SETTINGS_FILE_NAME);
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
          : DEFAULT_EXPERIMENTAL_PER_APP_AUDIO_ENABLED
    };
  } catch {
    return {
      autoUpdateEnabled: DEFAULT_AUTO_UPDATE_ENABLED,
      experimentalWgcCaptureEnabled: DEFAULT_EXPERIMENTAL_WGC_CAPTURE_ENABLED,
      experimentalPerAppAudioEnabled: DEFAULT_EXPERIMENTAL_PER_APP_AUDIO_ENABLED
    };
  }
}

export function setAutoUpdateEnabled(value: boolean): void {
  const settings = getSettings();
  settings.autoUpdateEnabled = value;
  writeFileSync(getSettingsFilePath(), JSON.stringify(settings), 'utf-8');
}

export function ensureSettingsFileExists(): void {
  const path = getSettingsFilePath();
  if (existsSync(path)) return;
  writeFileSync(path, JSON.stringify(getSettings()), 'utf-8');
}
