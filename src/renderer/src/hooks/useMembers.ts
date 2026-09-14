import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';
import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export function useMembers(roomClient: RoomClient): MemberSnapshot[] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => onTyped<RoomClientEventDetail['members-changed']>(roomClient, 'members-changed', onStoreChange),
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.getMembersSnapshot(), [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
