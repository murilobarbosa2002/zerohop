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
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { RoomStatus } from '@/constants/roomStatus';

export function App() {
  const roomClient = useRoomClient();
  const status = useRoomStatus(roomClient);
  const { status: updaterStatus, installUpdate, version } = useAppUpdater();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
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
        onOpenUpdates={() => setShowUpdates(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenLogs={() => setShowLogs(true)}
      />
      {showUpdates ? (
        <UpdatesScreen onBack={() => setShowUpdates(false)} />
      ) : showSettings ? (
        <SettingsScreen onBack={() => setShowSettings(false)} roomClient={inRoom ? roomClient : null} />
      ) : showLogs ? (
        <LogsScreen onBack={() => setShowLogs(false)} />
      ) : inRoom && roomCode ? (
        <Room
          roomClient={roomClient}
          roomCode={roomCode}
          onLeft={handleLeft}
          onOpenSettings={() => setShowSettings(true)}
          onOpenLogs={() => setShowLogs(true)}
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-7 py-7">
          <Header />
          <PreRoom roomClient={roomClient} onEntered={setRoomCode} />
          <StatusBar status={status} />
        </div>
      )}
    </div>
  );
}
