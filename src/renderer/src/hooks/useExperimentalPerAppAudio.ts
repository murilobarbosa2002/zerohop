import { useCallback, useEffect, useState } from 'react';

export function useExperimentalPerAppAudio(): [boolean, (value: boolean) => void] {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    window.api.getExperimentalPerAppAudioEnabled().then(setEnabledState);
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    window.api.setExperimentalPerAppAudioEnabled(value);
  }, []);

  return [enabled, setEnabled];
}
