import { useCallback, useRef, useState } from 'react';
import { RoomClient, type RoomClientEventDetail } from '@/services/RoomClient';
import { onTyped } from '@/lib/typedEvents';
import { playMemberJoinedSound, playMessageReceivedSound } from '@/services/soundEffects';

export interface RoomSession {
  sessionId: string;
  roomClient: RoomClient;
  roomCode: string | null;
  unreadCount: number;
}

export interface UseRoomSessionsResult {
  sessions: RoomSession[];
  focusedSessionId: string | null;
  createSession: () => RoomSession;
  markEntered: (sessionId: string, roomCode: string) => void;
  focus: (sessionId: string) => void;
  leave: (sessionId: string) => void;
}

export function useRoomSessions(): UseRoomSessionsResult {
  const [sessions, setSessions] = useState<RoomSession[]>([]);
  const [focusedSessionId, setFocusedSessionId] = useState<string | null>(null);
  const sessionsRef = useRef<RoomSession[]>([]);
  const focusedSessionIdRef = useRef<string | null>(null);
  const cleanupsRef = useRef(new Map<string, () => void>());

  sessionsRef.current = sessions;
  focusedSessionIdRef.current = focusedSessionId;

  const createSession = useCallback((): RoomSession => {
    const sessionId = crypto.randomUUID();
    const roomClient = new RoomClient();

    const unsubscribeJoined = onTyped<RoomClientEventDetail['member-joined']>(roomClient, 'member-joined', () => {
      playMemberJoinedSound();
    });
    const unsubscribeMessage = onTyped<RoomClientEventDetail['chat-message-received']>(
      roomClient,
      'chat-message-received',
      () => {
        playMessageReceivedSound();
        if (focusedSessionIdRef.current === sessionId) return;
        setSessions((current) =>
          current.map((session) =>
            session.sessionId === sessionId ? { ...session, unreadCount: session.unreadCount + 1 } : session
          )
        );
      }
    );
    cleanupsRef.current.set(sessionId, () => {
      unsubscribeJoined();
      unsubscribeMessage();
    });

    const session: RoomSession = { sessionId, roomClient, roomCode: null, unreadCount: 0 };
    setSessions((current) => [...current, session]);
    return session;
  }, []);

  const focus = useCallback((sessionId: string) => {
    if (focusedSessionIdRef.current === sessionId) return;
    const previous = sessionsRef.current.find((session) => session.sessionId === focusedSessionIdRef.current);
    previous?.roomClient.pauseVoice();
    const next = sessionsRef.current.find((session) => session.sessionId === sessionId);
    next?.roomClient.resumeVoice();
    focusedSessionIdRef.current = sessionId;
    setFocusedSessionId(sessionId);
    setSessions((current) =>
      current.map((session) => (session.sessionId === sessionId ? { ...session, unreadCount: 0 } : session))
    );
  }, []);

  const markEntered = useCallback(
    (sessionId: string, roomCode: string) => {
      setSessions((current) =>
        current.map((session) => (session.sessionId === sessionId ? { ...session, roomCode } : session))
      );
      focus(sessionId);
    },
    [focus]
  );

  const leave = useCallback((sessionId: string) => {
    const session = sessionsRef.current.find((current) => current.sessionId === sessionId);
    session?.roomClient.leaveRoom();
    cleanupsRef.current.get(sessionId)?.();
    cleanupsRef.current.delete(sessionId);

    const remaining = sessionsRef.current.filter((current) => current.sessionId !== sessionId);
    setSessions(remaining);

    if (focusedSessionIdRef.current === sessionId) {
      const nextFocused = remaining[0] ?? null;
      focusedSessionIdRef.current = nextFocused?.sessionId ?? null;
      setFocusedSessionId(nextFocused?.sessionId ?? null);
      nextFocused?.roomClient.resumeVoice();
    }
  }, []);

  return { sessions, focusedSessionId, createSession, markEntered, focus, leave };
}
