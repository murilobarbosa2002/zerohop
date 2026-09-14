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
import { AddRoomOverlay } from '@/components/AddRoomOverlay';
import { useRoomSessions } from '@/hooks/useRoomSessions';
import { useRoomStatus } from '@/hooks/useRoomStatus';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { useOverlay } from '@/hooks/useOverlay';
import { logEvent } from '@/services/appLog';
import { playJoinedRoomSound, playUpdateLaterSound } from '@/services/soundEffects';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { Overlay } from '@/constants/overlay';

export function App() {
  const {
    enteredSessions,
    focusedSession,
    focusedSessionId,
    pendingSession,
    startPendingSession,
    cancelPendingSession,
    markEntered,
    focus,
    leave
  } = useRoomSessions();
  const { activeOverlay, open: openOverlay, toggle: toggleOverlay, close: closeOverlay } = useOverlay();
  const { status: updaterStatus, installUpdate, version } = useAppUpdater();
  const [dismissedUpdateVersion, setDismissedUpdateVersion] = useState<string | null>(null);

  const statusRoomClient = (pendingSession ?? focusedSession ?? enteredSessions[0]).roomClient;
  const status = useRoomStatus(statusRoomClient);

  useEffect(() => {
    if (version) logEvent(LogCategory.APP, LogLevel.INFO, LOG_STRINGS.appStartedMessage(version));
  }, [version]);

  const updateReady = updaterStatus?.type === 'downloaded' && updaterStatus.version !== dismissedUpdateVersion ? updaterStatus : null;

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
                <Header />
                <PreRoom roomClient={pendingSession.roomClient} onEntered={handleEnteredRoom} />
                <StatusBar status={status} />
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
          {activeOverlay === Overlay.ADD_ROOM && pendingSession && (
            <AddRoomOverlay roomClient={pendingSession.roomClient} onEntered={handleEnteredRoom} onCancel={handleCancelAddRoom} />
          )}
        </div>
      </div>
    </div>
  );
}
