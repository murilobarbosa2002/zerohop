import { useCallback, useEffect, useRef, useState } from 'react';
import { playUpdateCheckSound, playUpdateFoundSound, playUpdateDownloadedSound, playUpdateInstallSound } from '@/services/soundEffects';
import type { UpdaterStatus } from '@shared/updaterStatus';
import type { AppUpdaterState } from '@/hooks/useAppUpdater.types';

export function useAppUpdater(): AppUpdaterState {
  const [version, setVersion] = useState('');
  const [isPackaged, setIsPackaged] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabledState] = useState(true);
  const [status, setStatus] = useState<UpdaterStatus | null>(null);
  const previousStatusType = useRef<UpdaterStatus['type'] | null>(null);

  useEffect(() => {
    window.api.getUpdaterInfo().then((info) => {
      setVersion(info.version);
      setIsPackaged(info.isPackaged);
      setAutoUpdateEnabledState(info.autoUpdateEnabled);
    });
  }, []);

  useEffect(
    () =>
      window.api.onUpdaterStatus((next) => {
        if (next.type === 'available' && previousStatusType.current !== 'available') playUpdateFoundSound();
        if (next.type === 'downloaded' && previousStatusType.current !== 'downloaded') playUpdateDownloadedSound();
        previousStatusType.current = next.type;
        setStatus(next);
      }),
    []
  );

  const checkForUpdates = useCallback(() => {
    playUpdateCheckSound();
    window.api.checkForUpdates();
  }, []);

  const installUpdate = useCallback(() => {
    playUpdateInstallSound();
    window.api.installUpdate();
  }, []);

  const setAutoUpdateEnabled = useCallback((value: boolean) => {
    setAutoUpdateEnabledState(value);
    window.api.setAutoUpdateEnabled(value);
  }, []);

  return { version, isPackaged, autoUpdateEnabled, status, checkForUpdates, installUpdate, setAutoUpdateEnabled };
}
