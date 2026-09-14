import { useCallback, useEffect, useRef, useState } from 'react';
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
  enteredSessions: RoomSession[];
  focusedSession: RoomSession | null;
  focusedSessionId: string | null;
  pendingSession: RoomSession | null;
  startPendingSession: () => void;
  cancelPendingSession: () => void;
  markEntered: (roomCode: string) => void;
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
    const unsubscribeMessage = onTyped<RoomClientEventDetail['chat-message-received']>(roomClient, 'chat-message-received', () => {
      playMessageReceivedSound();
      if (focusedSessionIdRef.current === sessionId) return;
      setSessions((current) =>
        current.map((session) => (session.sessionId === sessionId ? { ...session, unreadCount: session.unreadCount + 1 } : session))
      );
    });
    cleanupsRef.current.set(sessionId, () => {
      unsubscribeJoined();
      unsubscribeMessage();
    });

    const session: RoomSession = { sessionId, roomClient, roomCode: null, unreadCount: 0 };
    setSessions((current) => [...current, session]);
    return session;
  }, []);

  const [pendingSession, setPendingSession] = useState<RoomSession | null>(() => createSession());
  const pendingSessionRef = useRef<RoomSession | null>(null);
  pendingSessionRef.current = pendingSession;

  const startPendingSession = useCallback(() => {
    setPendingSession(createSession());
  }, [createSession]);

  const focus = useCallback((sessionId: string) => {
    if (focusedSessionIdRef.current === sessionId) return;
    const previous = sessionsRef.current.find((session) => session.sessionId === focusedSessionIdRef.current);
    previous?.roomClient.pauseVoice();
    const next = sessionsRef.current.find((session) => session.sessionId === sessionId);
    next?.roomClient.resumeVoice();
    focusedSessionIdRef.current = sessionId;
    setFocusedSessionId(sessionId);
    setSessions((current) => current.map((session) => (session.sessionId === sessionId ? { ...session, unreadCount: 0 } : session)));
  }, []);

  const markEntered = useCallback(
    (roomCode: string) => {
      const current = pendingSessionRef.current;
      if (!current) return;
      setSessions((sessions) => sessions.map((session) => (session.sessionId === current.sessionId ? { ...session, roomCode } : session)));
      focus(current.sessionId);
      setPendingSession(null);
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

    setPendingSession((current) => (current?.sessionId === sessionId ? null : current));
  }, []);

  const cancelPendingSession = useCallback(() => {
    if (pendingSessionRef.current) leave(pendingSessionRef.current.sessionId);
  }, [leave]);

  const enteredSessions = sessions.filter((session) => session.roomCode !== null);
  const focusedSession = enteredSessions.find((session) => session.sessionId === focusedSessionId) ?? null;

  useEffect(() => {
    if (enteredSessions.length === 0 && !pendingSession) startPendingSession();
  }, [enteredSessions.length, pendingSession, startPendingSession]);

  return {
    sessions,
    enteredSessions,
    focusedSession,
    focusedSessionId,
    pendingSession,
    startPendingSession,
    cancelPendingSession,
    markEntered,
    focus,
    leave
  };
}
