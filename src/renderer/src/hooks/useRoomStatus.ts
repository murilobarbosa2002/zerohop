import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';
import type { RoomStatus } from '@/constants/roomStatus';

export function useRoomStatus(roomClient: RoomClient): RoomStatus {
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      onTyped<RoomClientEventDetail['status-changed']>(roomClient, 'status-changed', onStoreChange),
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.status, [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
