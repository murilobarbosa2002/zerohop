import { useEffect, useState } from 'react';
import { onTyped } from '@/lib/typedEvents';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomClient, RoomClientEventDetail } from '@/services/RoomClient';

export function useConnectionWarning(roomClient: RoomClient): string | null {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(
    () =>
      onTyped<RoomClientEventDetail['connection-warning']>(roomClient, 'connection-warning', () => {
        setMessage(ROOM_STRINGS.connectionWarning);
      }),
    [roomClient]
  );

  return message;
}
