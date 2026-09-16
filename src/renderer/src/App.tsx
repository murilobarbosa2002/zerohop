import { useEffect, useState } from 'react';
import { TitleBar } from '@/components/TitleBar';
import { PreRoom } from '@/components/PreRoom';
import { Room } from '@/components/Room';
import { RoomSwitcher } from '@/components/RoomSwitcher';
import { UpdatesScreen } from '@/components/UpdatesScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { LogsScreen } from '@/components/LogsScreen';
import { NotificationsScreen } from '@/components/NotificationsScreen';
import { UpdateReadyModal } from '@/components/UpdateReadyModal';
import { AddRoomOverlay } from '@/components/AddRoomOverlay';
import { InviteReceivedModal } from '@/components/InviteReceivedModal';
import { useRoomSessions } from '@/hooks/useRoomSessions';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { useOverlay } from '@/hooks/useOverlay';
import { useNamePreference } from '@/hooks/useNamePreference';
import { useAvatarId } from '@/hooks/useAvatarId';
import { useNotifications } from '@/hooks/useNotifications';
import { useContacts } from '@/hooks/useContacts';
import { useAutoRoom } from '@/hooks/useAutoRoom';
import { useAutoInvite } from '@/hooks/useAutoInvite';
import { getAutoRoomId } from '@/services/autoRoomPreference';
import { logEvent } from '@/services/appLog';
import { notifyUser } from '@/services/notifyUser';
import { playJoinedRoomSound, playUpdateLaterSound } from '@/services/soundEffects';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { NOTIFICATIONS_STRINGS } from '@/strings/notifications.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { NotificationKind } from '@shared/notificationEntry';
import { Overlay } from '@/constants/overlay';

export function App() {
  const {
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
    declineInvite,
    findSessionByRoomCode
  } = useRoomSessions();
  const { activeOverlay, open: openOverlay, toggle: toggleOverlay, close: closeOverlay } = useOverlay();
  const { status: updaterStatus, installUpdate, version } = useAppUpdater();
  const [dismissedUpdateVersion, setDismissedUpdateVersion] = useState<string | null>(null);
  const [name] = useNamePreference();
  const [avatarId] = useAvatarId();
  const { unreadCount: unreadNotificationsCount } = useNotifications();
  const { contacts } = useContacts();
  const { inviteContactIds } = useAutoRoom();
  const autoRoomSession = findSessionByRoomCode(getAutoRoomId());
  useAutoInvite(autoRoomSession?.roomClient ?? null, contacts, inviteContactIds);

  useEffect(() => {
    if (version) logEvent(LogCategory.APP, LogLevel.INFO, LOG_STRINGS.appStartedMessage(version));
  }, [version]);

  const updateReady = updaterStatus?.type === 'downloaded' && updaterStatus.version !== dismissedUpdateVersion ? updaterStatus : null;

  useEffect(() => {
    if (updaterStatus?.type === 'downloaded') {
      notifyUser(NotificationKind.UPDATE_AVAILABLE, NOTIFICATIONS_STRINGS.updateAvailableMessage(updaterStatus.version));
    }
  }, [updaterStatus]);

  function handleEnteredRoom(code: string): void {
    markEntered(code);
    closeOverlay();
    playJoinedRoomSound();
  }

  function handleAddRoom(): void {
    startPendingSession();
    openOverlay(Overlay.ADD_ROOM);
  }

  function handleCancelAddRoom(): void {
    cancelPendingSession();
    closeOverlay();
  }

  return (
    <div className="h-full flex flex-col bg-bg text-text">
      {updateReady && (
        <UpdateReadyModal
          version={updateReady.version}
          onInstall={installUpdate}
          onDismiss={() => {
            playUpdateLaterSound();
            setDismissedUpdateVersion(updateReady.version);
          }}
        />
      )}
      <InviteReceivedModal
        invites={pendingInvites}
        onAccept={(inviteId) => acceptInvite(inviteId, name, avatarId)}
        onDecline={declineInvite}
      />
      <TitleBar
        onOpenUpdates={() => toggleOverlay(Overlay.UPDATES)}
        onOpenSettings={() => toggleOverlay(Overlay.SETTINGS)}
        onOpenLogs={() => toggleOverlay(Overlay.LOGS)}
        onOpenNotifications={() => toggleOverlay(Overlay.NOTIFICATIONS)}
        unreadNotificationsCount={unreadNotificationsCount}
      />
      <div className="flex-1 flex overflow-hidden">
        {enteredSessions.length > 0 && (
          <RoomSwitcher
            sessions={enteredSessions}
            focusedSessionId={focusedSessionId}
            onFocus={focus}
            onLeave={leave}
            onAddRoom={handleAddRoom}
          />
        )}

        <div className="flex-1 relative overflow-hidden">
          {focusedSession && focusedSession.roomCode ? (
            <Room
              roomClient={focusedSession.roomClient}
              roomCode={focusedSession.roomCode}
              onLeft={() => leave(focusedSession.sessionId)}
              onOpenSettings={() => toggleOverlay(Overlay.SETTINGS)}
              onOpenLogs={() => toggleOverlay(Overlay.LOGS)}
            />
          ) : (
            pendingSession &&
            enteredSessions.length === 0 && (
              <div className="absolute inset-0 overflow-y-auto px-7 py-7">
                <PreRoom
                  roomClient={pendingSession.roomClient}
                  onEntered={handleEnteredRoom}
                  findSessionByRoomCode={findSessionByRoomCode}
                />
              </div>
            )
          )}

          {activeOverlay === Overlay.UPDATES && (
            <div className="absolute inset-0 z-20 flex flex-col bg-bg">
              <UpdatesScreen onBack={closeOverlay} />
            </div>
          )}
          {activeOverlay === Overlay.SETTINGS && (
            <div className="absolute inset-0 z-20 flex flex-col bg-bg">
              <SettingsScreen onBack={closeOverlay} roomClient={focusedSession ? focusedSession.roomClient : null} />
            </div>
          )}
          {activeOverlay === Overlay.LOGS && (
            <div className="absolute inset-0 z-20 flex flex-col bg-bg">
              <LogsScreen onBack={closeOverlay} />
            </div>
          )}
          {activeOverlay === Overlay.NOTIFICATIONS && (
            <div className="absolute inset-0 z-20 flex flex-col bg-bg">
              <NotificationsScreen onBack={closeOverlay} />
            </div>
          )}
          {activeOverlay === Overlay.ADD_ROOM && pendingSession && (
            <AddRoomOverlay
              roomClient={pendingSession.roomClient}
              onEntered={handleEnteredRoom}
              onCancel={handleCancelAddRoom}
              findSessionByRoomCode={findSessionByRoomCode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
