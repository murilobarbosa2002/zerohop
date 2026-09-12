import { useEffect, useState } from 'react';
import { RoomSidebar } from '@/components/Room/RoomSidebar';
import { RoomStage } from '@/components/Room/RoomStage';
import { JoinRequestModal } from '@/components/Room/JoinRequestModal';
import { Chat } from '@/components/Chat';
import { useMembers } from '@/hooks/useMembers';
import { useSharing } from '@/hooks/useSharing';
import { useConnectionWarning } from '@/hooks/useConnectionWarning';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useJoinRequests } from '@/hooks/useJoinRequests';
import { useSourcePicker } from '@/hooks/useSourcePicker';
import { useMicMuted } from '@/hooks/useMicMuted';
import { useMemberAudioState } from '@/hooks/useMemberAudioState';
import { ROOM_STRINGS } from '@/strings/room.strings';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import type { RoomProps } from '@/components/Room/Room.types';

export function Room({ roomClient, roomCode, onLeft, onOpenSettings }: RoomProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [deafened, setDeafened] = useState(false);
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
  const sourcePicker = useSourcePicker();
  const members = useMembers(roomClient);
  const sharing = useSharing(roomClient);
  const micMuted = useMicMuted(roomClient);
  const voiceAudioState = useMemberAudioState();
  const connectionWarning = useConnectionWarning(roomClient);
  const chatMessages = useChatMessages(roomClient);
  const joinRequests = useJoinRequests(roomClient);

  const { refresh } = sourcePicker;
  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleLeave(): void {
    roomClient.leaveRoom();
    onLeft();
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {roomClient.isRoomCreator && (
        <JoinRequestModal
          requests={joinRequests}
          onApprove={(id) => roomClient.approveJoinRequest(id)}
          onDeny={(id) => roomClient.denyJoinRequest(id)}
        />
      )}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border flex-shrink-0">
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent"
        >
          {sidebarOpen ? ROOM_STRINGS.hideSidebarButton : ROOM_STRINGS.showSidebarButton}
        </button>
        <button
          onClick={() => setChatOpen((open) => !open)}
          className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent ml-auto"
        >
          {chatOpen ? ROOM_STRINGS.hideChatButton : ROOM_STRINGS.showChatButton}
        </button>
      </div>

      {connectionWarning && <p className="text-text-dim text-xs px-4 py-2 flex-shrink-0">{connectionWarning}</p>}

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <div className="w-room-sidebar-width flex-shrink-0 border-r border-border p-3.5">
            <RoomSidebar
              roomCode={roomCode}
              roomPassword={roomClient.roomPassword}
              members={members}
              canKick={roomClient.isRoomCreator}
              onToggleWatch={(id) => roomClient.toggleWatch(id)}
              onKick={(id) => roomClient.kickMember(id)}
              onLeave={handleLeave}
              micMuted={micMuted}
              deafened={deafened}
              onToggleMic={() => roomClient.toggleMicMuted()}
              onToggleDeafen={() => setDeafened((current) => !current)}
              voiceAudioState={voiceAudioState}
              sharing={sharing}
              onToggleSharePanel={() => setSharePanelOpen((current) => !current)}
              onOpenSettings={onOpenSettings}
            />
          </div>
        )}

        <div className="flex-1 p-3.5 overflow-hidden">
          <RoomStage
            roomClient={roomClient}
            sourcePicker={sourcePicker}
            sharing={sharing}
            members={members}
            panelOpen={sharePanelOpen}
            onSetPanelOpen={setSharePanelOpen}
          />
        </div>

        {chatOpen && (
          <div className="w-room-chat-width flex-shrink-0 border-l border-border p-3.5 flex flex-col overflow-hidden">
            <p className="font-bold text-body-sm-alt mb-2 flex-shrink-0">{CHAT_STRINGS.title}</p>
            <div className="flex-1 flex flex-col overflow-hidden">
              <Chat messages={chatMessages} onSend={(text) => roomClient.sendChatMessage(text)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
