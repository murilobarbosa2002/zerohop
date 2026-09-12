import { useEffect, useState } from 'react';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { AudioOutputDeviceOption } from '@/hooks/useAudioOutputDevices.types';

async function listAudioOutputDevices(): Promise<AudioOutputDeviceOption[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((device) => device.kind === 'audiooutput')
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: device.label || SETTINGS_STRINGS.unnamedAudioOutputLabel(index + 1)
    }));
}

export function useAudioOutputDevices(): AudioOutputDeviceOption[] {
  const [devices, setDevices] = useState<AudioOutputDeviceOption[]>([]);

  useEffect(() => {
    function refresh(): void {
      listAudioOutputDevices().then(setDevices);
    }

    refresh();
    navigator.mediaDevices.addEventListener('devicechange', refresh);
    return () => navigator.mediaDevices.removeEventListener('devicechange', refresh);
  }, []);

  return devices;
}
