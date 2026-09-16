import { useEffect, useRef, useState } from 'react';
import { RoomSidebar } from '@/components/Room/RoomSidebar';
import { RoomStage } from '@/components/Room/RoomStage';
import { JoinRequestModal } from '@/components/Room/JoinRequestModal';
import { VoiceAudioSinks } from '@/components/Room/VoiceAudioSinks';
import { Chat } from '@/components/Chat';
import { ResizeHandle } from '@/components/ResizeHandle';
import { useResizablePanelWidth } from '@/hooks/useResizablePanelWidth';
import { useMembers } from '@/hooks/useMembers';
import { useSharing } from '@/hooks/useSharing';
import { useConnectionWarning } from '@/hooks/useConnectionWarning';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useJoinRequests } from '@/hooks/useJoinRequests';
import { useSourcePicker } from '@/hooks/useSourcePicker';
import { useMicMuted } from '@/hooks/useMicMuted';
import { usePushToTalk } from '@/hooks/usePushToTalk';
import { useMemberAudioState } from '@/hooks/useMemberAudioState';
import { useContacts } from '@/hooks/useContacts';
import {
  playMicMuteSound,
  playMicUnmuteSound,
  playDeafenSound,
  playUndeafenSound,
  playKickSound,
  playJoinApprovedSound,
  playJoinDeniedSound,
  playSidebarShowSound,
  playSidebarHideSound,
  playChatShowSound,
  playChatHideSound,
  playMessageDeletedRemoteSound,
  playJoinRequestSound,
  playMemberLeftSound,
  playRoomLeftSound
} from '@/services/soundEffects';
import { onTyped } from '@/lib/typedEvents';
import { ROOM_STRINGS } from '@/strings/room.strings';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import type { RoomClientEventDetail } from '@/services/RoomClient';
import type { RoomProps } from '@/components/Room/Room.types';

export function Room({ roomClient, roomCode, onLeft }: RoomProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useResizablePanelWidth('zerohop:sidebarWidth', 300, 300, 420);
  const [chatWidth, setChatWidth] = useResizablePanelWidth('zerohop:chatWidth', 300, 300, 480);
  const [deafened, setDeafened] = useState(false);
  const pushToTalkOriginRef = useRef(false);
  const { active: pushToTalkActive, configured: pushToTalkConfigured } = usePushToTalk(roomClient, pushToTalkOriginRef);
  const sourcePicker = useSourcePicker();
  const members = useMembers(roomClient);
  const { contacts, addContact } = useContacts();
  const sharing = useSharing(roomClient);
  const micMuted = useMicMuted(roomClient);
  const voiceAudioState = useMemberAudioState();
  const connectionWarning = useConnectionWarning(roomClient);
  const chatMessages = useChatMessages(roomClient);
  const joinRequests = useJoinRequests(roomClient);
  const [previousJoinRequestCount, setPreviousJoinRequestCount] = useState(0);

  const { refresh } = sourcePicker;
  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(
    () =>
      onTyped<RoomClientEventDetail['mic-muted-changed']>(roomClient, 'mic-muted-changed', (detail) => {
        if (pushToTalkOriginRef.current) return;
        detail.muted ? playMicMuteSound() : playMicUnmuteSound();
      }),
    [roomClient]
  );

  useEffect(
    () =>
      onTyped<RoomClientEventDetail['chat-message-deleted-remote']>(roomClient, 'chat-message-deleted-remote', () =>
        playMessageDeletedRemoteSound()
      ),
    [roomClient]
  );

  useEffect(() => {
    if (joinRequests.length > previousJoinRequestCount) {
      playJoinRequestSound();
      window.api.focusWindow();
    }
    setPreviousJoinRequestCount(joinRequests.length);
  }, [joinRequests.length, previousJoinRequestCount]);

  useEffect(() => onTyped<RoomClientEventDetail['member-left']>(roomClient, 'member-left', () => playMemberLeftSound()), [roomClient]);

  function toggleDeafen(): void {
    setDeafened((current) => {
      const next = !current;
      if (next) playDeafenSound();
      else playUndeafenSound();
      return next;
    });
  }

  useEffect(() => window.api.onHotkeyMicMuteToggle(() => roomClient.toggleMicMuted()), [roomClient]);

  useEffect(() => window.api.onHotkeyDeafenToggle(() => toggleDeafen()), []);

  function handleLeave(): void {
    roomClient.leaveRoom();
    playRoomLeftSound();
    onLeft();
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {roomClient.isRoomCreator && (
        <JoinRequestModal
          requests={joinRequests}
          onApprove={(id) => {
            roomClient.approveJoinRequest(id);
            playJoinApprovedSound();
          }}
          onDeny={(id) => {
            roomClient.denyJoinRequest(id);
            playJoinDeniedSound();
          }}
        />
      )}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border flex-shrink-0">
        <button
          onClick={() =>
            setSidebarOpen((open) => {
              const next = !open;
              if (next) playSidebarShowSound();
              else playSidebarHideSound();
              return next;
            })
          }
          className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent"
        >
          {sidebarOpen ? ROOM_STRINGS.hideSidebarButton : ROOM_STRINGS.showSidebarButton}
        </button>
        <button
          onClick={() =>
            setChatOpen((open) => {
              const next = !open;
              if (next) playChatShowSound();
              else playChatHideSound();
              return next;
            })
          }
          className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent ml-auto"
        >
          {chatOpen ? ROOM_STRINGS.hideChatButton : ROOM_STRINGS.showChatButton}
        </button>
      </div>

      <VoiceAudioSinks members={members} voiceAudioState={voiceAudioState} deafened={deafened} />

      {connectionWarning && <p className="text-text-dim text-xs px-4 py-2 flex-shrink-0">{connectionWarning}</p>}

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <>
            <div className="flex-shrink-0 border-r border-border p-3.5 overflow-y-auto" style={{ width: sidebarWidth }}>
              <RoomSidebar
                roomCode={roomCode}
                roomPassword={roomClient.roomPassword}
                members={members}
                canKick={roomClient.isRoomCreator}
                onToggleWatch={(id) => roomClient.toggleWatch(id)}
                onKick={(id) => {
                  roomClient.kickMember(id);
                  playKickSound();
                }}
                onLeave={handleLeave}
                micMuted={micMuted}
                deafened={deafened}
                pushToTalkActive={pushToTalkActive}
                onToggleMic={() => roomClient.toggleMicMuted()}
                onToggleDeafen={toggleDeafen}
                voiceAudioState={voiceAudioState}
                pushToTalkConfigured={pushToTalkConfigured}
                contacts={contacts}
                onAddContact={addContact}
                onInviteContact={(contact) => roomClient.inviteContact(contact)}
                hasContactJoinedViaInvite={(contactId) => roomClient.hasContactJoinedViaInvite(contactId)}
              />
            </div>
            <ResizeHandle onDrag={(deltaX) => setSidebarWidth((width) => width + deltaX)} />
          </>
        )}

        <div className="flex-1 p-3.5 overflow-hidden">
          <RoomStage roomClient={roomClient} sourcePicker={sourcePicker} sharing={sharing} members={members} />
        </div>

        {chatOpen && (
          <>
            <ResizeHandle onDrag={(deltaX) => setChatWidth((width) => width - deltaX)} />
            <div className="flex-shrink-0 border-l border-border p-3.5 flex flex-col overflow-hidden" style={{ width: chatWidth }}>
              <p className="font-bold text-body-sm-alt mb-2 flex-shrink-0">{CHAT_STRINGS.title}</p>
              <div className="flex-1 flex flex-col overflow-hidden">
                <Chat
                  messages={chatMessages}
                  onSend={(text) => roomClient.sendChatMessage(text)}
                  onDelete={(id) => roomClient.deleteChatMessage(id)}
                  canDelete={(message) => roomClient.canDeleteChatMessage(message)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
