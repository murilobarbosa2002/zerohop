import { app } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { SETTINGS_FILE_NAME, DEFAULT_AUTO_UPDATE_ENABLED } from '@main/constants/settings';

interface AppSettings {
  autoUpdateEnabled: boolean;
}

function getSettingsFilePath(): string {
  return join(app.getPath('userData'), SETTINGS_FILE_NAME);
}

export function getSettings(): AppSettings {
  try {
    const raw = readFileSync(getSettingsFilePath(), 'utf-8');
    const parsed = JSON.parse(raw);
    return { autoUpdateEnabled: typeof parsed.autoUpdateEnabled === 'boolean' ? parsed.autoUpdateEnabled : DEFAULT_AUTO_UPDATE_ENABLED };
  } catch {
    return { autoUpdateEnabled: DEFAULT_AUTO_UPDATE_ENABLED };
  }
}

export function setAutoUpdateEnabled(value: boolean): void {
  const settings = getSettings();
  settings.autoUpdateEnabled = value;
  writeFileSync(getSettingsFilePath(), JSON.stringify(settings), 'utf-8');
}
