import { useCallback, useEffect, useState } from 'react';

export function useExperimentalCapture(): [boolean, (value: boolean) => void] {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    window.api.getExperimentalCaptureEnabled().then(setEnabledState);
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    window.api.setExperimentalCaptureEnabled(value);
  }, []);

  return [enabled, setEnabled];
}
