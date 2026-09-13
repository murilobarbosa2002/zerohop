import { useEffect, useState } from 'react';
import { TitleBar } from '@/components/TitleBar';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { PreRoom } from '@/components/PreRoom';
import { Room } from '@/components/Room';
import { RoomSwitcher } from '@/components/RoomSwitcher';
import { UpdatesScreen } from '@/components/UpdatesScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { LogsScreen } from '@/components/LogsScreen';
import { UpdateReadyModal } from '@/components/UpdateReadyModal';
import { ActionButton } from '@/components/ActionButton';
import { useRoomSessions, type RoomSession } from '@/hooks/useRoomSessions';
import { useRoomStatus } from '@/hooks/useRoomStatus';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { logEvent } from '@/services/appLog';
import { playJoinedRoomSound, playScreenOpenSound, playScreenCloseSound } from '@/services/soundEffects';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { Overlay } from '@/constants/overlay';

export function App() {
  const { sessions, focusedSessionId, createSession, markEntered, focus, leave } = useRoomSessions();
  const [pendingSession, setPendingSession] = useState<RoomSession | null>(() => createSession());
  const [activeOverlay, setActiveOverlay] = useState<Overlay | null>(null);
  const { status: updaterStatus, installUpdate, version } = useAppUpdater();
  const [dismissedUpdateVersion, setDismissedUpdateVersion] = useState<string | null>(null);

  const enteredSessions = sessions.filter((session) => session.roomCode !== null);
  const focusedSession = enteredSessions.find((session) => session.sessionId === focusedSessionId) ?? null;
  const statusRoomClient = (pendingSession ?? focusedSession ?? sessions[0]).roomClient;
  const status = useRoomStatus(statusRoomClient);

  useEffect(() => {
    if (enteredSessions.length === 0 && !pendingSession) {
      setPendingSession(createSession());
    }
  }, [enteredSessions.length, pendingSession, createSession]);

  useEffect(() => {
    if (version) logEvent(LogCategory.APP, LogLevel.INFO, LOG_STRINGS.appStartedMessage(version));
  }, [version]);
  const updateReady =
    updaterStatus?.type === 'downloaded' && updaterStatus.version !== dismissedUpdateVersion ? updaterStatus : null;

  function handleEnteredRoom(code: string): void {
    if (!pendingSession) return;
    markEntered(pendingSession.sessionId, code);
    setPendingSession(null);
    setActiveOverlay(null);
    playJoinedRoomSound();
  }

  function handleAddRoom(): void {
    setPendingSession(createSession());
    playScreenOpenSound();
    setActiveOverlay(Overlay.ADD_ROOM);
  }

  function handleCancelAddRoom(): void {
    if (pendingSession) leave(pendingSession.sessionId);
    setPendingSession(null);
    playScreenCloseSound();
    setActiveOverlay(null);
  }

  function handleFocusSession(sessionId: string): void {
    focus(sessionId);
  }

  function handleLeaveSession(sessionId: string): void {
    leave(sessionId);
  }

  function toggleOverlay(overlay: Overlay): void {
    setActiveOverlay((current) => {
      if (current === overlay) {
        playScreenCloseSound();
        return null;
      }
      playScreenOpenSound();
      return overlay;
    });
  }

  function closeOverlay(): void {
    playScreenCloseSound();
    setActiveOverlay(null);
  }

  return (
    <div className="h-full flex flex-col bg-bg text-text">
      {updateReady && (
        <UpdateReadyModal
          version={updateReady.version}
          onInstall={installUpdate}
          onDismiss={() => setDismissedUpdateVersion(updateReady.version)}
        />
      )}
      <TitleBar
        onOpenUpdates={() => toggleOverlay(Overlay.UPDATES)}
        onOpenSettings={() => toggleOverlay(Overlay.SETTINGS)}
        onOpenLogs={() => toggleOverlay(Overlay.LOGS)}
      />
      <div className="flex-1 flex overflow-hidden">
        {enteredSessions.length > 0 && (
          <RoomSwitcher
            sessions={enteredSessions}
            focusedSessionId={focusedSessionId}
            onFocus={handleFocusSession}
            onLeave={handleLeaveSession}
            onAddRoom={handleAddRoom}
          />
        )}

        <div className="flex-1 relative overflow-hidden">
          {focusedSession && focusedSession.roomCode ? (
            <Room
              roomClient={focusedSession.roomClient}
              roomCode={focusedSession.roomCode}
              onLeft={() => handleLeaveSession(focusedSession.sessionId)}
              onOpenSettings={() => toggleOverlay(Overlay.SETTINGS)}
              onOpenLogs={() => toggleOverlay(Overlay.LOGS)}
            />
          ) : (
            pendingSession &&
            enteredSessions.length === 0 && (
              <div className="absolute inset-0 overflow-y-auto px-7 py-7">
                <Header />
                <PreRoom roomClient={pendingSession.roomClient} onEntered={handleEnteredRoom} />
                <StatusBar status={status} />
              </div>
            )
          )}

          {activeOverlay === Overlay.UPDATES && (
            <div className="absolute inset-0 flex flex-col bg-bg">
              <UpdatesScreen onBack={closeOverlay} />
            </div>
          )}
          {activeOverlay === Overlay.SETTINGS && (
            <div className="absolute inset-0 flex flex-col bg-bg">
              <SettingsScreen onBack={closeOverlay} roomClient={focusedSession ? focusedSession.roomClient : null} />
            </div>
          )}
          {activeOverlay === Overlay.LOGS && (
            <div className="absolute inset-0 flex flex-col bg-bg">
              <LogsScreen onBack={closeOverlay} />
            </div>
          )}
          {activeOverlay === Overlay.ADD_ROOM && pendingSession && (
            <div className="absolute inset-0 flex flex-col bg-bg overflow-y-auto px-7 py-7">
              <div className="flex items-center gap-3 mb-4">
                <ActionButton variant="default" onClick={handleCancelAddRoom}>
                  {PRE_ROOM_STRINGS.backButton}
                </ActionButton>
              </div>
              <Header />
              <PreRoom roomClient={pendingSession.roomClient} onEntered={handleEnteredRoom} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
