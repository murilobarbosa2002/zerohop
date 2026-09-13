import { useEffect, useState } from 'react';

export function useExperimentalPerAppAudio(): boolean {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    window.api.getExperimentalPerAppAudioEnabled().then(setEnabled);
  }, []);

  return enabled;
}
