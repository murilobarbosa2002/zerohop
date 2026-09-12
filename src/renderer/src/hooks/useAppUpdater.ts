import { useCallback, useEffect, useState } from 'react';
import type { UpdaterStatus } from '@shared/updaterStatus';
import type { AppUpdaterState } from '@/hooks/useAppUpdater.types';

export function useAppUpdater(): AppUpdaterState {
  const [version, setVersion] = useState('');
  const [isPackaged, setIsPackaged] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabledState] = useState(true);
  const [status, setStatus] = useState<UpdaterStatus | null>(null);

  useEffect(() => {
    window.api.getUpdaterInfo().then((info) => {
      setVersion(info.version);
      setIsPackaged(info.isPackaged);
      setAutoUpdateEnabledState(info.autoUpdateEnabled);
    });
  }, []);

  useEffect(() => window.api.onUpdaterStatus(setStatus), []);

  const checkForUpdates = useCallback(() => {
    window.api.checkForUpdates();
  }, []);

  const installUpdate = useCallback(() => {
    window.api.installUpdate();
  }, []);

  const setAutoUpdateEnabled = useCallback((value: boolean) => {
    setAutoUpdateEnabledState(value);
    window.api.setAutoUpdateEnabled(value);
  }, []);

  return { version, isPackaged, autoUpdateEnabled, status, checkForUpdates, installUpdate, setAutoUpdateEnabled };
}
