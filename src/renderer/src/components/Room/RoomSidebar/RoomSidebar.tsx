import { Card, CardTitle } from '@/components/Card';
import { RoomHeader } from '@/components/Room/RoomHeader';
import { RoomToolbar } from '@/components/Room/RoomToolbar';
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
  onToggleMic,
  onToggleDeafen,
  voiceAudioState,
  onOpenLogs,
  onOpenSettings
}: RoomSidebarProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      <RoomHeader roomCode={roomCode} roomPassword={roomPassword} onLeave={onLeave} />
      <RoomToolbar
        micMuted={micMuted}
        deafened={deafened}
        pushToTalkActive={pushToTalkActive}
        onToggleMic={onToggleMic}
        onToggleDeafen={onToggleDeafen}
        onOpenLogs={onOpenLogs}
        onOpenSettings={onOpenSettings}
      />
      <Card>
        <CardTitle>{ROOM_STRINGS.participantsTitle}</CardTitle>
        <ParticipantsView
          members={members}
          onToggleWatch={onToggleWatch}
          canKick={canKick}
          onKick={onKick}
          voiceAudioState={voiceAudioState}
        />
      </Card>
    </div>
  );
}
