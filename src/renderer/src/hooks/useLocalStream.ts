import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';

export function useLocalStream(roomClient: RoomClient): MediaStream | null {
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      onTyped<RoomClientEventDetail['local-stream-changed']>(roomClient, 'local-stream-changed', onStoreChange),
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.localStream, [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
