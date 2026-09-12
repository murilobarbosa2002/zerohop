import { useEffect } from 'react';
import { Card, CardTitle } from '@/components/Card';
import { RoomHeader } from '@/components/Room/RoomHeader';
import { ShareControls } from '@/components/Room/ShareControls';
import { ParticipantsView } from '@/components/ParticipantsView';
import { Chat } from '@/components/Chat';
import { useMembers } from '@/hooks/useMembers';
import { useSharing } from '@/hooks/useSharing';
import { useConnectionWarning } from '@/hooks/useConnectionWarning';
import { useChatMessages } from '@/hooks/useChatMessages';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import { useSourcePicker } from '@/hooks/useSourcePicker';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomProps } from '@/components/Room/Room.types';

export function Room({ roomClient, roomCode, onLeft }: RoomProps) {
  const sourcePicker = useSourcePicker();
  const members = useMembers(roomClient);
  const sharing = useSharing(roomClient);
  const connectionWarning = useConnectionWarning(roomClient);
  const chatMessages = useChatMessages(roomClient);

  const { refresh } = sourcePicker;
  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleLeave(): void {
    roomClient.leaveRoom();
    onLeft();
  }

  return (
    <div>
      <RoomHeader roomCode={roomCode} roomPassword={roomClient.roomPassword} onLeave={handleLeave} />
      <ShareControls roomClient={roomClient} sourcePicker={sourcePicker} sharing={sharing} />
      <Card>
        <CardTitle>{ROOM_STRINGS.participantsTitle}</CardTitle>
        {connectionWarning && <p className="text-text-dim text-xs mb-2">{connectionWarning}</p>}
        <ParticipantsView
          members={members}
          onToggleWatch={(id) => roomClient.toggleWatch(id)}
          canKick={roomClient.isRoomCreator}
          onKick={(id) => roomClient.kickMember(id)}
        />
      </Card>
      <Card>
        <CardTitle>{CHAT_STRINGS.title}</CardTitle>
        <Chat messages={chatMessages} onSend={(text) => roomClient.sendChatMessage(text)} />
      </Card>
    </div>
  );
}
