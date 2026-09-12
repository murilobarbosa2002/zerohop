import { useState } from 'react';
import { RoomClient } from '@/services/RoomClient';

export function useRoomClient(): RoomClient {
  const [client] = useState(() => new RoomClient());
  return client;
}
