import { useSyncExternalStore } from 'react';
import { getAudioOutputDeviceId, setAudioOutputDeviceId, subscribeToAudioOutputDevice } from '@/services/audioOutputPreference';

export function useAudioOutputDevice(): [string, (deviceId: string) => void] {
  const deviceId = useSyncExternalStore(subscribeToAudioOutputDevice, getAudioOutputDeviceId);
  return [deviceId, setAudioOutputDeviceId];
}
