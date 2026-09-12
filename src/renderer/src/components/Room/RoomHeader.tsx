import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { COMMON_STRINGS } from '@/strings/common.strings';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomHeaderProps } from '@/components/Room/RoomHeader.types';

export function RoomHeader({ roomCode, roomPassword, onLeave }: RoomHeaderProps) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 bg-panel-2 border border-border rounded-lg px-3 py-2">
          <span className="text-body-xs text-text-dim">{ROOM_STRINGS.roomCodeLabel}</span>
          <span className="font-mono font-bold tracking-wide text-accent">{roomCode}</span>
          <button
            onClick={() => navigator.clipboard.writeText(roomCode)}
            className="bg-accent-soft text-accent rounded-full px-2.5 py-1 text-badge-xs font-bold hover:brightness-110"
          >
            {COMMON_STRINGS.copyButton}
          </button>
        </div>
        {roomPassword && (
          <div className="flex items-center justify-between gap-2 bg-panel-2 border border-border rounded-lg px-3 py-2">
            <span className="text-body-xs text-text-dim">{ROOM_STRINGS.roomPasswordLabel}</span>
            <span className="font-mono font-bold tracking-wide text-accent">{roomPassword}</span>
            <button
              onClick={() => navigator.clipboard.writeText(roomPassword)}
              className="bg-accent-soft text-accent rounded-full px-2.5 py-1 text-badge-xs font-bold hover:brightness-110"
            >
              {COMMON_STRINGS.copyButton}
            </button>
          </div>
        )}
        <ActionButton variant="danger" onClick={onLeave}>
          {ROOM_STRINGS.leaveRoomButton}
        </ActionButton>
      </div>
    </Card>
  );
}
