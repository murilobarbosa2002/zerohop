import type { RoomClient } from '@/services/RoomClient';

export interface PreRoomProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  findSessionByRoomCode: (roomCode: string) => { roomClient: RoomClient } | null;
}

export interface PreRoomChoiceProps {
  onSelectCreate: () => void;
  onSelectJoin: () => void;
  onSelectContacts: () => void;
}

export interface CreateRoomFormProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  onBack: () => void;
}

export interface JoinRoomFormProps {
  roomClient: RoomClient;
  onEntered: (code: string) => void;
  onBack: () => void;
}
