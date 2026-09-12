import { useEffect, useState } from 'react';
import { TitleBar } from '@/components/TitleBar';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { PreRoom } from '@/components/PreRoom';
import { Room } from '@/components/Room';
import { UpdatesScreen } from '@/components/UpdatesScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { LogsScreen } from '@/components/LogsScreen';
import { UpdateReadyModal } from '@/components/UpdateReadyModal';
import { useRoomClient } from '@/hooks/useRoomClient';
import { useRoomStatus } from '@/hooks/useRoomStatus';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { logEvent } from '@/services/appLog';
import { playJoinedRoomSound } from '@/services/soundEffects';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { RoomStatus } from '@/constants/roomStatus';
import { Overlay } from '@/constants/overlay';

export function App() {
  const roomClient = useRoomClient();
  const status = useRoomStatus(roomClient);
  const { status: updaterStatus, installUpdate, version } = useAppUpdater();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<Overlay | null>(null);
  const [dismissedUpdateVersion, setDismissedUpdateVersion] = useState<string | null>(null);
  const inRoom = status === RoomStatus.CONNECTED && roomCode !== null;

  useEffect(() => {
    if (version) logEvent(LogCategory.APP, LogLevel.INFO, LOG_STRINGS.appStartedMessage(version));
  }, [version]);
  const updateReady =
    updaterStatus?.type === 'downloaded' && updaterStatus.version !== dismissedUpdateVersion ? updaterStatus : null;

  function handleLeft(): void {
    setRoomCode(null);
  }

  function handleEntered(code: string): void {
    setRoomCode(code);
    playJoinedRoomSound();
  }

  function toggleOverlay(overlay: Overlay): void {
    setActiveOverlay((current) => (current === overlay ? null : overlay));
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
      <div className="flex-1 relative overflow-hidden">
        {inRoom && roomCode ? (
          <Room
            roomClient={roomClient}
            roomCode={roomCode}
            onLeft={handleLeft}
            onOpenSettings={() => toggleOverlay(Overlay.SETTINGS)}
            onOpenLogs={() => toggleOverlay(Overlay.LOGS)}
          />
        ) : (
          <div className="absolute inset-0 overflow-y-auto px-7 py-7">
            <Header />
            <PreRoom roomClient={roomClient} onEntered={handleEntered} />
            <StatusBar status={status} />
          </div>
        )}

        {activeOverlay === Overlay.UPDATES && (
          <div className="absolute inset-0 flex flex-col bg-bg">
            <UpdatesScreen onBack={() => setActiveOverlay(null)} />
          </div>
        )}
        {activeOverlay === Overlay.SETTINGS && (
          <div className="absolute inset-0 flex flex-col bg-bg">
            <SettingsScreen onBack={() => setActiveOverlay(null)} roomClient={inRoom ? roomClient : null} />
          </div>
        )}
        {activeOverlay === Overlay.LOGS && (
          <div className="absolute inset-0 flex flex-col bg-bg">
            <LogsScreen onBack={() => setActiveOverlay(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
