import { useCallback, useEffect, useState } from 'react';
import type { UpdaterStatus } from '@shared/updaterStatus';
import type { AppUpdaterState } from '@/hooks/useAppUpdater.types';

export function useAppUpdater(): AppUpdaterState {
  const [version, setVersion] = useState('');
  const [isPackaged, setIsPackaged] = useState(false);
  const [status, setStatus] = useState<UpdaterStatus | null>(null);

  useEffect(() => {
    window.api.getUpdaterInfo().then((info) => {
      setVersion(info.version);
      setIsPackaged(info.isPackaged);
    });
  }, []);

  useEffect(() => window.api.onUpdaterStatus(setStatus), []);

  const checkForUpdates = useCallback(() => {
    window.api.checkForUpdates();
  }, []);

  const installUpdate = useCallback(() => {
    window.api.installUpdate();
  }, []);

  return { version, isPackaged, status, checkForUpdates, installUpdate };
}
