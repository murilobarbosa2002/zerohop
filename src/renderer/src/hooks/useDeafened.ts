import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';

export function useDeafened(roomClient: RoomClient): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => onTyped<RoomClientEventDetail['deafened-changed']>(roomClient, 'deafened-changed', onStoreChange),
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.deafened, [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
