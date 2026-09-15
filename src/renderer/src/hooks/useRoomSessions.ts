import { useCallback, useEffect, useRef, useState } from 'react';
import { RoomClient, type RoomClientEventDetail } from '@/services/RoomClient';
import { onTyped } from '@/lib/typedEvents';
import { playMemberJoinedSound, playMessageReceivedSound, playInviteReceivedSound, playJoinedRoomSound } from '@/services/soundEffects';
import { logEvent } from '@/services/appLog';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import type { AvatarId } from '@/constants/avatars';

export interface RoomSession {
  sessionId: string;
  roomClient: RoomClient;
  roomCode: string | null;
  unreadCount: number;
}

export interface PendingInvite {
  inviteId: string;
  fromId: string;
  roomCode: string;
  roomPassword: string;
  inviteToken: string;
  hostName: string;
  hostAvatarId: AvatarId;
}

export interface UseRoomSessionsResult {
  sessions: RoomSession[];
  enteredSessions: RoomSession[];
  focusedSession: RoomSession | null;
  focusedSessionId: string | null;
  pendingSession: RoomSession | null;
  pendingInvites: PendingInvite[];
  startPendingSession: () => void;
  cancelPendingSession: () => void;
  markEntered: (roomCode: string) => void;
  focus: (sessionId: string) => void;
  leave: (sessionId: string) => void;
  acceptInvite: (inviteId: string, name: string, avatarId: AvatarId) => Promise<void>;
  declineInvite: (inviteId: string) => void;
}

export function useRoomSessions(): UseRoomSessionsResult {
  const [sessions, setSessions] = useState<RoomSession[]>([]);
  const [focusedSessionId, setFocusedSessionId] = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
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
    const unsubscribeInvite = onTyped<RoomClientEventDetail['invite-received']>(roomClient, 'invite-received', (detail) => {
      playInviteReceivedSound();
      setPendingInvites((current) => [...current, { inviteId: crypto.randomUUID(), ...detail }]);
    });
    cleanupsRef.current.set(sessionId, () => {
      unsubscribeJoined();
      unsubscribeMessage();
      unsubscribeInvite();
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

  const leave = useCallback(
    (sessionId: string) => {
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

      const stillPending = pendingSessionRef.current?.sessionId === sessionId ? null : pendingSessionRef.current;
      const remainingEntered = remaining.some((current) => current.roomCode !== null);

      if (!stillPending && !remainingEntered) {
        setPendingSession(createSession());
      } else {
        setPendingSession(stillPending);
      }
    },
    [createSession]
  );

  const cancelPendingSession = useCallback(() => {
    if (pendingSessionRef.current) leave(pendingSessionRef.current.sessionId);
  }, [leave]);

  const declineInvite = useCallback((inviteId: string) => {
    setPendingInvites((current) => current.filter((invite) => invite.inviteId !== inviteId));
  }, []);

  const acceptInvite = useCallback(
    async (inviteId: string, name: string, avatarId: AvatarId) => {
      const invite = pendingInvites.find((current) => current.inviteId === inviteId);
      declineInvite(inviteId);
      if (!invite) return;
      const session = createSession();
      try {
        const roomCode = await session.roomClient.joinRoom(name, invite.roomCode, invite.roomPassword, avatarId, invite.inviteToken);
        setSessions((current) => current.map((item) => (item.sessionId === session.sessionId ? { ...item, roomCode } : item)));
        focus(session.sessionId);
        playJoinedRoomSound();
      } catch (error) {
        logEvent(LogCategory.ROOM, LogLevel.WARNING, LOG_STRINGS.inviteJoinFailedMessage(invite.hostName), (error as Error).message);
        leave(session.sessionId);
      }
    },
    [pendingInvites, declineInvite, createSession, focus, leave]
  );

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
    pendingInvites,
    startPendingSession,
    cancelPendingSession,
    markEntered,
    focus,
    leave,
    acceptInvite,
    declineInvite
  };
}
