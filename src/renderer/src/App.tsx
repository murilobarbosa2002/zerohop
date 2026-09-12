import { useState } from 'react';
import { TitleBar } from '@/components/TitleBar';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { PreRoom } from '@/components/PreRoom';
import { Room } from '@/components/Room';
import { UpdatesScreen } from '@/components/UpdatesScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { useRoomClient } from '@/hooks/useRoomClient';
import { useRoomStatus } from '@/hooks/useRoomStatus';
import { RoomStatus } from '@/constants/roomStatus';

export function App() {
  const roomClient = useRoomClient();
  const status = useRoomStatus(roomClient);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const inRoom = status === RoomStatus.CONNECTED && roomCode !== null;

  function handleLeft(): void {
    setRoomCode(null);
  }

  return (
    <div className="h-full flex flex-col bg-bg text-text">
      <TitleBar onOpenUpdates={() => setShowUpdates(true)} onOpenSettings={() => setShowSettings(true)} />
      {showUpdates ? (
        <UpdatesScreen onBack={() => setShowUpdates(false)} />
      ) : showSettings ? (
        <SettingsScreen onBack={() => setShowSettings(false)} roomClient={inRoom ? roomClient : null} />
      ) : inRoom && roomCode ? (
        <Room roomClient={roomClient} roomCode={roomCode} onLeft={handleLeft} />
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
