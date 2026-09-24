import { useEffect, useMemo, useRef, useState } from 'react';
import { RoomSidebar } from '@/components/Room/RoomSidebar';
import { RoomStage } from '@/components/Room/RoomStage';
import { JoinRequestModal } from '@/components/Room/JoinRequestModal';
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
import { useDeafened } from '@/hooks/useDeafened';
import { useViewerIds } from '@/hooks/useViewerIds';
import { useContacts } from '@/hooks/useContacts';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { ROOM_STAGE_MIN_WIDTH_PX, RESIZE_HANDLE_WIDTH_PX } from '@/constants/layout';
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
  playRoomLeftSound,
  playMemberSharingStartedSound,
  playWatchStartedSound,
  playWatchStoppedSound,
  playViewerJoinedWatchingSound,
  playViewerLeftWatchingSound
} from '@/services/soundEffects';
import { onTyped } from '@/lib/typedEvents';
import { resolveContactDisplayName } from '@/lib/resolveContactDisplayName';
import { ROOM_STRINGS } from '@/strings/room.strings';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import type { RoomClientEventDetail } from '@/services/RoomClient';
import type { RoomProps } from '@/components/Room/Room.types';

export function Room({ roomClient, roomCode, voiceAudioState, onLeft }: RoomProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useResizablePanelWidth('zerohop:sidebarWidth', 300, 300, 420);
  const [chatWidth, setChatWidth] = useResizablePanelWidth('zerohop:chatWidth', 300, 300, 480);
  const windowWidth = useWindowWidth();
  const handleCount = (sidebarOpen ? 1 : 0) + (chatOpen ? 1 : 0);
  const availableForPanels = Math.max(0, windowWidth - ROOM_STAGE_MIN_WIDTH_PX - handleCount * RESIZE_HANDLE_WIDTH_PX);
  const renderedSidebarWidth = sidebarOpen ? Math.min(sidebarWidth, availableForPanels) : 0;
  const renderedChatWidth = chatOpen ? Math.min(chatWidth, Math.max(0, availableForPanels - renderedSidebarWidth)) : 0;
  const pushToTalkOriginRef = useRef(false);
  const { active: pushToTalkActive, configured: pushToTalkConfigured } = usePushToTalk(roomClient, pushToTalkOriginRef);
  const sourcePicker = useSourcePicker();
  const members = useMembers(roomClient);
  const { contacts, addContact } = useContacts();
  const sharing = useSharing(roomClient);
  const micMuted = useMicMuted(roomClient);
  const deafened = useDeafened(roomClient);
  const viewerIds = useViewerIds(roomClient);
  const connectionWarning = useConnectionWarning(roomClient);
  const rawChatMessages = useChatMessages(roomClient);
  const chatMessages = useMemo(() => {
    const memberPersonalIdById = new Map(members.map((member) => [member.id, member.personalId]));
    return rawChatMessages.map((message) => ({
      ...message,
      fromName: resolveContactDisplayName(message.fromName, memberPersonalIdById.get(message.fromId) ?? null, contacts)
    }));
  }, [rawChatMessages, members, contacts]);
  const joinRequests = useJoinRequests(roomClient);
  const [previousJoinRequestCount, setPreviousJoinRequestCount] = useState(0);
  const [failedInviteContactIds, setFailedInviteContactIds] = useState<Set<string>>(new Set());

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

  useEffect(
    () =>
      onTyped<RoomClientEventDetail['member-sharing-started']>(roomClient, 'member-sharing-started', () => playMemberSharingStartedSound()),
    [roomClient]
  );

  useEffect(
    () => onTyped<RoomClientEventDetail['watch-started']>(roomClient, 'watch-started', () => playWatchStartedSound()),
    [roomClient]
  );

  useEffect(
    () => onTyped<RoomClientEventDetail['watch-stopped']>(roomClient, 'watch-stopped', () => playWatchStoppedSound()),
    [roomClient]
  );

  useEffect(
    () => onTyped<RoomClientEventDetail['viewer-added']>(roomClient, 'viewer-added', () => playViewerJoinedWatchingSound()),
    [roomClient]
  );

  useEffect(
    () => onTyped<RoomClientEventDetail['viewer-removed']>(roomClient, 'viewer-removed', () => playViewerLeftWatchingSound()),
    [roomClient]
  );

  useEffect(
    () =>
      onTyped<RoomClientEventDetail['invite-send-failed']>(roomClient, 'invite-send-failed', (detail) => {
        setFailedInviteContactIds((current) => new Set(current).add(detail.contactId));
      }),
    [roomClient]
  );

  useEffect(
    () =>
      onTyped<RoomClientEventDetail['invite-rejected']>(roomClient, 'invite-rejected', (detail) => {
        setFailedInviteContactIds((current) => new Set(current).add(detail.contactId));
      }),
    [roomClient]
  );

  useEffect(
    () =>
      onTyped<RoomClientEventDetail['deafened-changed']>(roomClient, 'deafened-changed', (detail) => {
        detail.deafened ? playDeafenSound() : playUndeafenSound();
      }),
    [roomClient]
  );

  useEffect(() => window.api.onHotkeyMicMuteToggle(() => roomClient.toggleMicMuted()), [roomClient]);

  useEffect(() => window.api.onHotkeyDeafenToggle(() => roomClient.toggleDeafen()), [roomClient]);

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
          className="text-body-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent"
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
          className="text-body-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent ml-auto"
        >
          {chatOpen ? ROOM_STRINGS.hideChatButton : ROOM_STRINGS.showChatButton}
        </button>
      </div>

      {connectionWarning && <p className="text-text-dim text-xs px-4 py-2 flex-shrink-0">{connectionWarning}</p>}

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <>
            <div className="flex-shrink-0 border-r border-border p-3.5 overflow-y-auto" style={{ width: renderedSidebarWidth }}>
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
                onToggleDeafen={() => roomClient.toggleDeafen()}
                voiceAudioState={voiceAudioState}
                viewerIds={viewerIds}
                mySharingActive={sharing}
                pushToTalkConfigured={pushToTalkConfigured}
                contacts={contacts}
                onAddContact={addContact}
                onInviteContact={(contact) => {
                  setFailedInviteContactIds((current) => {
                    if (!current.has(contact.id)) return current;
                    const next = new Set(current);
                    next.delete(contact.id);
                    return next;
                  });
                  roomClient.inviteContact(contact);
                }}
                hasContactJoinedViaInvite={(contactId) => roomClient.hasContactJoinedViaInvite(contactId)}
                failedInviteContactIds={failedInviteContactIds}
              />
            </div>
            <ResizeHandle onDrag={(deltaX) => setSidebarWidth((width) => width + deltaX)} />
          </>
        )}

        <div className="flex-1 min-w-stage-min p-3.5 overflow-hidden">
          <RoomStage roomClient={roomClient} sourcePicker={sourcePicker} sharing={sharing} members={members} />
        </div>

        {chatOpen && (
          <>
            <ResizeHandle onDrag={(deltaX) => setChatWidth((width) => width - deltaX)} />
            <div className="flex-shrink-0 border-l border-border p-3.5 flex flex-col overflow-hidden" style={{ width: renderedChatWidth }}>
              <p className="font-bold text-body-sm-alt mb-2 flex-shrink-0">{CHAT_STRINGS.title}</p>
              <div className="flex-1 flex flex-col overflow-hidden">
                <Chat
                  messages={chatMessages}
                  onSend={(text, replyToId) => roomClient.sendChatMessage(text, replyToId)}
                  onDelete={(id) => roomClient.deleteChatMessage(id)}
                  canDelete={(message) => roomClient.canDeleteChatMessage(message)}
                  onEdit={(id, text) => roomClient.editChatMessage(id, text)}
                  canEdit={(message) => roomClient.canEditChatMessage(message)}
                  onToggleReaction={(id, emoji) => roomClient.toggleChatReaction(id, emoji)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
