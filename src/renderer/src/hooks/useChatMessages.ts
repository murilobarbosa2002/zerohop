import { useCallback, useSyncExternalStore } from 'react';
import { onTyped } from '@/lib/typedEvents';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';
import type { ChatMessageEntry } from '@/services/room/ChatService';

export function useChatMessages(roomClient: RoomClient): ChatMessageEntry[] {
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      onTyped<RoomClientEventDetail['chat-changed']>(roomClient, 'chat-changed', onStoreChange),
    [roomClient]
  );
  const getSnapshot = useCallback(() => roomClient.getChatMessages(), [roomClient]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
