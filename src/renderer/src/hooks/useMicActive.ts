import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';

export function useMicActive(roomClient: RoomClient | null): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!roomClient) return () => {};
      return onTyped<RoomClientEventDetail['mic-active-changed']>(roomClient, 'mic-active-changed', onStoreChange);
    },
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient?.micActive ?? false, [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
