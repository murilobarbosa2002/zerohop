import type { UpdaterStatus } from '@shared/updaterStatus';

export interface AppUpdaterState {
  version: string;
  isPackaged: boolean;
  status: UpdaterStatus | null;
  checkForUpdates: () => void;
  installUpdate: () => void;
}
