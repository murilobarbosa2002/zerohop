import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail, JoinRequestEntry } from '@/services/RoomClient';

export function useJoinRequests(roomClient: RoomClient): JoinRequestEntry[] {
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      onTyped<RoomClientEventDetail['join-requests-changed']>(roomClient, 'join-requests-changed', onStoreChange),
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.getPendingJoinRequests(), [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
