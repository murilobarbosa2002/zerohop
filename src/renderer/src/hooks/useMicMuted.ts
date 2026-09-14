import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';

export function useMicMuted(roomClient: RoomClient): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => onTyped<RoomClientEventDetail['mic-muted-changed']>(roomClient, 'mic-muted-changed', onStoreChange),
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.micMuted, [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
