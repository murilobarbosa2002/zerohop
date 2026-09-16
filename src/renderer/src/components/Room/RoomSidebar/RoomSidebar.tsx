import { useState } from 'react';
import { Card, CardTitle } from '@/components/Card';
import { RoomHeader } from '@/components/Room/RoomHeader';
import { RoomToolbar } from '@/components/Room/RoomToolbar';
import { InviteContactsPanel } from '@/components/Room/InviteContactsPanel';
import { ParticipantsView } from '@/components/ParticipantsView';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomSidebarProps } from '@/components/Room/RoomSidebar/RoomSidebar.types';

export function RoomSidebar({
  roomCode,
  roomPassword,
  members,
  canKick,
  onToggleWatch,
  onKick,
  onLeave,
  micMuted,
  deafened,
  pushToTalkActive,
  pushToTalkConfigured,
  onToggleMic,
  onToggleDeafen,
  voiceAudioState,
  contacts,
  onAddContact,
  onInviteContact,
  hasContactJoinedViaInvite
}: RoomSidebarProps) {
  const [contactsPanelOpen, setContactsPanelOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide">
      <RoomHeader roomCode={roomCode} roomPassword={roomPassword} onLeave={onLeave} />
      <RoomToolbar
        micMuted={micMuted}
        deafened={deafened}
        pushToTalkActive={pushToTalkActive}
        pushToTalkConfigured={pushToTalkConfigured}
        onToggleMic={onToggleMic}
        onToggleDeafen={onToggleDeafen}
        contactsPanelOpen={contactsPanelOpen}
        onToggleContactsPanel={() => setContactsPanelOpen((current) => !current)}
      />
      {contactsPanelOpen && (
        <InviteContactsPanel
          contacts={contacts}
          members={members}
          hasContactJoinedViaInvite={hasContactJoinedViaInvite}
          onInvite={onInviteContact}
        />
      )}
      <Card>
        <CardTitle>{ROOM_STRINGS.participantsTitle}</CardTitle>
        <ParticipantsView
          members={members}
          onToggleWatch={onToggleWatch}
          canKick={canKick}
          onKick={onKick}
          voiceAudioState={voiceAudioState}
          contacts={contacts}
          onAddContact={onAddContact}
        />
      </Card>
    </div>
  );
}
