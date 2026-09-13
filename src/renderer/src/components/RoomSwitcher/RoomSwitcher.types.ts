import type { RoomSession } from '@/hooks/useRoomSessions';

export interface RoomSwitcherProps {
  sessions: RoomSession[];
  focusedSessionId: string | null;
  onFocus: (sessionId: string) => void;
  onLeave: (sessionId: string) => void;
  onAddRoom: () => void;
}
