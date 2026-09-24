import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';

export function useViewerIds(roomClient: RoomClient): string[] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsubscribeAdded = onTyped<RoomClientEventDetail['viewer-added']>(roomClient, 'viewer-added', onStoreChange);
      const unsubscribeRemoved = onTyped<RoomClientEventDetail['viewer-removed']>(roomClient, 'viewer-removed', onStoreChange);
      return () => {
        unsubscribeAdded();
        unsubscribeRemoved();
      };
    },
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.getViewerIds(), [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
