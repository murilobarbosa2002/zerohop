import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';

export function useSharing(roomClient: RoomClient): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      onTyped<RoomClientEventDetail['sharing-changed']>(roomClient, 'sharing-changed', onStoreChange),
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.sharing, [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
