import { useCallback, useEffect, useRef, useState } from 'react';
import { RoomClient, type RoomClientEventDetail } from '@/services/RoomClient';
import { createMemberAudioStateStore } from '@/hooks/useMemberAudioState';
import { onTyped } from '@/lib/typedEvents';
import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';
import {
  playMemberJoinedSound,
  playMessageReceivedSound,
  playInviteReceivedSound,
  playJoinedRoomSound,
  playInviteFailedNotificationSound
} from '@/services/soundEffects';
import { logEvent } from '@/services/appLog';
import { notifyUser } from '@/services/notifyUser';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { NOTIFICATIONS_STRINGS } from '@/strings/notifications.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { NotificationKind } from '@shared/notificationEntry';
import { getName } from '@/services/namePreference';
import { getAvatarId } from '@/services/avatarPreference';
import { getPersonalId, getPersonalPassword, getPersonalAutoOpenEnabled } from '@/services/personalRoomPreference';
import { INVITE_TOKEN_TTL_MS } from '@/constants/timing';
import type { AvatarId } from '@/constants/avatars';

async function resolveContactName(contactId: string): Promise<string> {
  const contacts = await window.api.getContacts();
  return contacts.find((contact) => contact.id === contactId)?.name ?? contactId;
}

export interface RoomSession {
  sessionId: string;
  roomClient: RoomClient;
  roomCode: string | null;
  unreadCount: number;
  voiceAudioState: MemberAudioStateStore;
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
  markEntered: (roomCode: string) => void;
  focus: (sessionId: string) => void;
  leave: (sessionId: string) => void;
  acceptInvite: (inviteId: string, name: string, avatarId: AvatarId) => Promise<void>;
  declineInvite: (inviteId: string) => void;
  findSessionByRoomCode: (roomCode: string) => RoomSession | null;
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

    let previousJoinRequestCount = 0;

    const unsubscribeJoined = onTyped<RoomClientEventDetail['member-joined']>(roomClient, 'member-joined', (detail) => {
      playMemberJoinedSound();
      notifyUser(NotificationKind.MEMBER_JOINED, NOTIFICATIONS_STRINGS.memberJoinedMessage(detail.name));
    });
    const unsubscribeLeft = onTyped<RoomClientEventDetail['member-left']>(roomClient, 'member-left', (detail) => {
      notifyUser(NotificationKind.MEMBER_LEFT, NOTIFICATIONS_STRINGS.memberLeftMessage(detail.name));
    });
    const unsubscribeMessage = onTyped<RoomClientEventDetail['chat-message-received']>(roomClient, 'chat-message-received', () => {
      playMessageReceivedSound();
      if (focusedSessionIdRef.current === sessionId) return;
      setSessions((current) =>
        current.map((session) => (session.sessionId === sessionId ? { ...session, unreadCount: session.unreadCount + 1 } : session))
      );
    });
    const unsubscribeInvite = onTyped<RoomClientEventDetail['invite-received']>(roomClient, 'invite-received', (detail) => {
      const inviteId = crypto.randomUUID();
      playInviteReceivedSound();
      notifyUser(NotificationKind.INVITE_RECEIVED, NOTIFICATIONS_STRINGS.inviteReceivedMessage(detail.hostName), { inviteId });
      setPendingInvites((current) => [...current, { inviteId, ...detail }]);
      setTimeout(() => {
        setPendingInvites((current) => current.filter((item) => item.inviteId !== inviteId));
      }, INVITE_TOKEN_TTL_MS);
    });
    const unsubscribeInviteSendFailed = onTyped<RoomClientEventDetail['invite-send-failed']>(roomClient, 'invite-send-failed', (detail) => {
      resolveContactName(detail.contactId).then((name) => {
        playInviteFailedNotificationSound();
        notifyUser(NotificationKind.INVITE_FAILED, NOTIFICATIONS_STRINGS.inviteSendFailedMessage(name));
      });
    });
    const unsubscribeInviteRejected = onTyped<RoomClientEventDetail['invite-rejected']>(roomClient, 'invite-rejected', (detail) => {
      resolveContactName(detail.contactId).then((name) => {
        playInviteFailedNotificationSound();
        notifyUser(NotificationKind.INVITE_FAILED, NOTIFICATIONS_STRINGS.inviteRejectedUnknownSenderMessage(name));
      });
    });
    const unsubscribeJoinRequests = onTyped<RoomClientEventDetail['join-requests-changed']>(
      roomClient,
      'join-requests-changed',
      (detail) => {
        if (detail.requests.length > previousJoinRequestCount) {
          const newest = detail.requests[detail.requests.length - 1];
          notifyUser(NotificationKind.JOIN_REQUEST, NOTIFICATIONS_STRINGS.joinRequestMessage(newest.name));
        }
        previousJoinRequestCount = detail.requests.length;
      }
    );
    cleanupsRef.current.set(sessionId, () => {
      unsubscribeJoined();
      unsubscribeLeft();
      unsubscribeMessage();
      unsubscribeInvite();
      unsubscribeInviteSendFailed();
      unsubscribeInviteRejected();
      unsubscribeJoinRequests();
    });

    const session: RoomSession = {
      sessionId,
      roomClient,
      roomCode: null,
      unreadCount: 0,
      voiceAudioState: createMemberAudioStateStore()
    };
    setSessions((current) => [...current, session]);
    return session;
  }, []);

  const [pendingSession, setPendingSession] = useState<RoomSession | null>(() => createSession());
  const pendingSessionRef = useRef<RoomSession | null>(null);
  pendingSessionRef.current = pendingSession;

  const hasBootstrappedAutoSessions = useRef(false);
  useEffect(() => {
    if (hasBootstrappedAutoSessions.current) return;
    hasBootstrappedAutoSessions.current = true;

    const name = getName();
    const avatarId = getAvatarId();

    const personalPassword = getPersonalPassword();
    if (personalPassword && getPersonalAutoOpenEnabled()) {
      const session = createSession();
      session.roomClient.createRoom(name, personalPassword, avatarId, getPersonalId()).then((roomCode) => {
        setSessions((current) => current.map((item) => (item.sessionId === session.sessionId ? { ...item, roomCode } : item)));
      });
    }
  }, [createSession]);

  const startPendingSession = useCallback(() => {
    setPendingSession(createSession());
  }, [createSession]);

  const focus = useCallback((sessionId: string) => {
    if (focusedSessionIdRef.current === sessionId) return;
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

  const declineInvite = useCallback((inviteId: string) => {
    setPendingInvites((current) => {
      const invite = current.find((item) => item.inviteId === inviteId);
      if (invite) notifyUser(NotificationKind.INVITE_DECLINED, NOTIFICATIONS_STRINGS.inviteDeclinedMessage(invite.hostName));
      return current.filter((item) => item.inviteId !== inviteId);
    });
  }, []);

  const acceptInvite = useCallback(
    async (inviteId: string, name: string, avatarId: AvatarId) => {
      const invite = pendingInvites.find((current) => current.inviteId === inviteId);
      setPendingInvites((current) => current.filter((item) => item.inviteId !== inviteId));
      if (!invite) return;
      const session = createSession();
      try {
        const roomCode = await session.roomClient.joinRoom(name, invite.roomCode, invite.roomPassword, avatarId, invite.inviteToken);
        setSessions((current) => current.map((item) => (item.sessionId === session.sessionId ? { ...item, roomCode } : item)));
        focus(session.sessionId);
        playJoinedRoomSound();
        notifyUser(NotificationKind.INVITE_ACCEPTED, NOTIFICATIONS_STRINGS.inviteAcceptedMessage(invite.hostName));
      } catch (error) {
        logEvent(LogCategory.ROOM, LogLevel.WARNING, LOG_STRINGS.inviteJoinFailedMessage(invite.hostName), (error as Error).message);
        leave(session.sessionId);
      }
    },
    [pendingInvites, createSession, focus, leave]
  );

  const findSessionByRoomCode = useCallback(
    (roomCode: string): RoomSession | null => sessionsRef.current.find((session) => session.roomCode === roomCode) ?? null,
    []
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
    markEntered,
    focus,
    leave,
    acceptInvite,
    declineInvite,
    findSessionByRoomCode
  };
}
