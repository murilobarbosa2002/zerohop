import { useState } from 'react';
import { TitleBar } from '@/components/TitleBar';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { PreRoom } from '@/components/PreRoom';
import { Room } from '@/components/Room';
import { useRoomClient } from '@/hooks/useRoomClient';
import { useRoomStatus } from '@/hooks/useRoomStatus';
import { RoomStatus } from '@/constants/roomStatus';

export function App() {
  const roomClient = useRoomClient();
  const status = useRoomStatus(roomClient);
  const [roomCode, setRoomCode] = useState<string | null>(null);

  function handleLeft(): void {
    setRoomCode(null);
  }

  return (
    <div className="h-full flex flex-col bg-bg text-text">
      <TitleBar />
      <div className="flex-1 overflow-y-auto px-7 py-7">
        <Header />
        {status === RoomStatus.CONNECTED && roomCode ? (
          <Room roomClient={roomClient} roomCode={roomCode} onLeft={handleLeft} />
        ) : (
          <PreRoom roomClient={roomClient} onEntered={setRoomCode} />
        )}
        <StatusBar status={status} />
      </div>
    </div>
  );
}
