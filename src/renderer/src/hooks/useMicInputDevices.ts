import { useEffect, useState } from 'react';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { MicInputDeviceOption } from '@/hooks/useMicInputDevices.types';

async function listMicInputDevices(): Promise<MicInputDeviceOption[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((device) => device.kind === 'audioinput')
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: device.label || SETTINGS_STRINGS.unnamedMicInputLabel(index + 1)
    }));
}

export function useMicInputDevices(): MicInputDeviceOption[] {
  const [devices, setDevices] = useState<MicInputDeviceOption[]>([]);

  useEffect(() => {
    function refresh(): void {
      listMicInputDevices().then(setDevices);
    }

    refresh();
    navigator.mediaDevices.addEventListener('devicechange', refresh);
    return () => navigator.mediaDevices.removeEventListener('devicechange', refresh);
  }, []);

  return devices;
}
