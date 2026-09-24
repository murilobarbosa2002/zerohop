import { useEffect, useRef, useState } from 'react';
import { TitleBar } from '@/components/TitleBar';
import { PreRoom } from '@/components/PreRoom';
import { Room } from '@/components/Room';
import { RoomSwitcher } from '@/components/RoomSwitcher';
import { UpdatesScreen } from '@/components/UpdatesScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { LogsScreen } from '@/components/LogsScreen';
import { NotificationsScreen } from '@/components/NotificationsScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { UpdateReadyModal } from '@/components/UpdateReadyModal';
import { PersonalRoomPasswordMissingModal } from '@/components/PersonalRoomPasswordMissingModal';
import { AddRoomOverlay } from '@/components/AddRoomOverlay';
import { InviteReceivedModal } from '@/components/InviteReceivedModal';
import { RoomVoiceSink } from '@/components/RoomVoiceSink';
import { useRoomSessions } from '@/hooks/useRoomSessions';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { useOverlay } from '@/hooks/useOverlay';
import { useNamePreference } from '@/hooks/useNamePreference';
import { useAvatarId } from '@/hooks/useAvatarId';
import { useNotifications } from '@/hooks/useNotifications';
import { useContacts } from '@/hooks/useContacts';
import { logEvent } from '@/services/appLog';
import { notifyUser } from '@/services/notifyUser';
import { contactsPresenceStore, type ContactsPresenceEventDetail } from '@/services/contactsPresenceStore';
import { onTyped } from '@/lib/typedEvents';
import {
  getPersonalPassword,
  getPersonalAutoOpenEnabled,
  getPersonalPasswordReminderLastShownDate,
  setPersonalPasswordReminderLastShownDate,
  hasPersonalRoomBeenConfigured
} from '@/services/personalRoomPreference';
import {
  playJoinedRoomSound,
  playUpdateLaterSound,
  playSwitchRoomSound,
  playInviteAcceptSound,
  playInviteDeclineSound,
  playUpdateAvailableNotificationSound,
  playPersonalRoomPasswordMissingNotificationSound,
  playContactOnlineNotificationSound
} from '@/services/soundEffects';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { NOTIFICATIONS_STRINGS } from '@/strings/notifications.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { NotificationKind } from '@shared/notificationEntry';
import { Overlay } from '@/constants/overlay';
import { PreRoomScreen } from '@/constants/preRoomScreen';
import { SettingsCategory } from '@/constants/settingsCategory';
import type { NotificationEntry } from '@shared/notificationEntry';

export function App() {
  const {
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
  } = useRoomSessions();
  const { activeOverlay, open: openOverlay, toggle: toggleOverlay, close: closeOverlay } = useOverlay();
  const { status: updaterStatus, installUpdate, version } = useAppUpdater();
  const [dismissedUpdateVersion, setDismissedUpdateVersion] = useState<string | null>(null);
  const [name] = useNamePreference();
  const [avatarId] = useAvatarId();
  const { unreadCount: unreadNotificationsCount } = useNotifications();
  const { contacts } = useContacts();
  const [showPersonalRoomPasswordWarning, setShowPersonalRoomPasswordWarning] = useState(false);
  const [settingsInitialCategory, setSettingsInitialCategory] = useState<SettingsCategory>(SettingsCategory.AUDIO);
  const overlayBeforeProfileRef = useRef<Overlay | null>(null);

  useEffect(() => {
    if (version) logEvent(LogCategory.APP, LogLevel.INFO, LOG_STRINGS.appStartedMessage(version));
  }, [version]);

  useEffect(() => {
    contactsPresenceStore.setContactIds(contacts.map((contact) => contact.id));
  }, [contacts]);

  useEffect(() => {
    contactsPresenceStore.start();
    return () => contactsPresenceStore.stop();
  }, []);

  useEffect(
    () =>
      onTyped<ContactsPresenceEventDetail['contact-online']>(contactsPresenceStore, 'contact-online', ({ contactId }) => {
        const contact = contacts.find((current) => current.id === contactId);
        if (!contact) return;
        playContactOnlineNotificationSound();
        notifyUser(NotificationKind.CONTACT_ONLINE, NOTIFICATIONS_STRINGS.contactOnlineMessage(contact.name));
      }),
    [contacts]
  );

  useEffect(() => {
    if (!hasPersonalRoomBeenConfigured() || !getPersonalAutoOpenEnabled() || getPersonalPassword()) return;
    setShowPersonalRoomPasswordWarning(true);
    const today = new Date().toDateString();
    if (getPersonalPasswordReminderLastShownDate() === today) return;
    setPersonalPasswordReminderLastShownDate(today);
    playPersonalRoomPasswordMissingNotificationSound();
    notifyUser(NotificationKind.PERSONAL_ROOM_PASSWORD_MISSING, NOTIFICATIONS_STRINGS.personalRoomPasswordMissingMessage);
  }, []);

  const updateReady = updaterStatus?.type === 'downloaded' && updaterStatus.version !== dismissedUpdateVersion ? updaterStatus : null;

  useEffect(() => {
    if (updaterStatus?.type === 'downloaded') {
      playUpdateAvailableNotificationSound();
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

  function handleOpenContacts(): void {
    startPendingSession();
    openOverlay(Overlay.CONTACTS);
  }

  function handleOpenProfile(): void {
    overlayBeforeProfileRef.current = activeOverlay;
    openOverlay(Overlay.PROFILE);
  }

  function handleProfileBack(): void {
    if (overlayBeforeProfileRef.current) {
      openOverlay(overlayBeforeProfileRef.current);
      overlayBeforeProfileRef.current = null;
    } else {
      closeOverlay();
    }
  }

  function openPersonalRoomSettings(): void {
    setSettingsInitialCategory(SettingsCategory.CONTACTS);
    openOverlay(Overlay.SETTINGS);
  }

  function handleOpenSettings(): void {
    setSettingsInitialCategory(SettingsCategory.AUDIO);
    toggleOverlay(Overlay.SETTINGS);
  }

  function handleSetPersonalRoomPasswordNow(): void {
    setShowPersonalRoomPasswordWarning(false);
    openPersonalRoomSettings();
  }

  function handleNotificationNavigate(entry: NotificationEntry): void {
    if (entry.kind === NotificationKind.UPDATE_AVAILABLE) {
      openOverlay(Overlay.UPDATES);
    } else if (entry.kind === NotificationKind.PERSONAL_ROOM_PASSWORD_MISSING) {
      openPersonalRoomSettings();
    }
  }

  function handleAcceptInvite(inviteId: string): void {
    playInviteAcceptSound();
    acceptInvite(inviteId, name, avatarId);
  }

  function handleDeclineInvite(inviteId: string): void {
    playInviteDeclineSound();
    declineInvite(inviteId);
  }

  function handleFocusSession(sessionId: string): void {
    const alreadyFocused = sessionId === focusedSessionId;
    closeOverlay();
    if (alreadyFocused) return;
    playSwitchRoomSound();
    focus(sessionId);
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
      {showPersonalRoomPasswordWarning && (
        <PersonalRoomPasswordMissingModal
          onSetPasswordNow={handleSetPersonalRoomPasswordNow}
          onDismiss={() => setShowPersonalRoomPasswordWarning(false)}
        />
      )}
      <InviteReceivedModal invites={pendingInvites} onAccept={handleAcceptInvite} onDecline={handleDeclineInvite} />
      {enteredSessions.map((session) => (
        <RoomVoiceSink key={session.sessionId} roomClient={session.roomClient} voiceAudioState={session.voiceAudioState} />
      ))}
      <TitleBar
        onOpenUpdates={() => toggleOverlay(Overlay.UPDATES)}
        onOpenSettings={handleOpenSettings}
        onOpenLogs={() => toggleOverlay(Overlay.LOGS)}
        onOpenNotifications={() => toggleOverlay(Overlay.NOTIFICATIONS)}
        onOpenContacts={handleOpenContacts}
        onOpenProfile={handleOpenProfile}
        unreadNotificationsCount={unreadNotificationsCount}
      />
      <div className="flex-1 flex overflow-hidden">
        {enteredSessions.length > 0 && (
          <RoomSwitcher
            sessions={enteredSessions}
            focusedSessionId={focusedSessionId}
            onFocus={handleFocusSession}
            onLeave={leave}
            onAddRoom={handleAddRoom}
          />
        )}

        <div className="flex-1 relative overflow-hidden">
          {focusedSession && focusedSession.roomCode ? (
            <Room
              roomClient={focusedSession.roomClient}
              roomCode={focusedSession.roomCode}
              voiceAudioState={focusedSession.voiceAudioState}
              onLeft={() => leave(focusedSession.sessionId)}
            />
          ) : (
            pendingSession &&
            !focusedSession && (
              <div
                className="absolute inset-0 overflow-y-auto px-7 py-7"
                aria-hidden={activeOverlay !== null}
                inert={activeOverlay !== null}
              >
                <PreRoom
                  roomClient={pendingSession.roomClient}
                  onEntered={handleEnteredRoom}
                  onOpenUpdates={() => openOverlay(Overlay.UPDATES)}
                  onOpenPersonalRoomSettings={openPersonalRoomSettings}
                  onOpenProfile={handleOpenProfile}
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
              <SettingsScreen
                onBack={closeOverlay}
                roomClient={focusedSession ? focusedSession.roomClient : null}
                findSessionByRoomCode={findSessionByRoomCode}
                initialCategory={settingsInitialCategory}
              />
            </div>
          )}
          {activeOverlay === Overlay.PROFILE && (
            <div className="absolute inset-0 z-20 overflow-y-auto bg-bg px-7 py-7">
              <ProfileScreen onBack={handleProfileBack} />
            </div>
          )}
          {activeOverlay === Overlay.LOGS && (
            <div className="absolute inset-0 z-20 flex flex-col bg-bg">
              <LogsScreen onBack={closeOverlay} />
            </div>
          )}
          {activeOverlay === Overlay.NOTIFICATIONS && (
            <div className="absolute inset-0 z-20 flex flex-col bg-bg">
              <NotificationsScreen
                onBack={closeOverlay}
                pendingInvites={pendingInvites}
                onAcceptInvite={handleAcceptInvite}
                onDeclineInvite={handleDeclineInvite}
                onNavigate={handleNotificationNavigate}
              />
            </div>
          )}
          {(activeOverlay === Overlay.ADD_ROOM || activeOverlay === Overlay.CONTACTS) && pendingSession && (
            <AddRoomOverlay
              roomClient={pendingSession.roomClient}
              onEntered={handleEnteredRoom}
              initialScreen={activeOverlay === Overlay.CONTACTS ? PreRoomScreen.CONTACTS : undefined}
              onOpenUpdates={() => openOverlay(Overlay.UPDATES)}
              onOpenPersonalRoomSettings={openPersonalRoomSettings}
              onOpenProfile={handleOpenProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
