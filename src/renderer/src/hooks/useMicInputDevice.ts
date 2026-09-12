import { useSyncExternalStore } from 'react';
import { getMicInputDeviceId, setMicInputDeviceId, subscribeToMicInputDevice } from '@/services/micInputPreference';

export function useMicInputDevice(): [string, (deviceId: string) => void] {
  const deviceId = useSyncExternalStore(subscribeToMicInputDevice, getMicInputDeviceId);
  return [deviceId, setMicInputDeviceId];
}
