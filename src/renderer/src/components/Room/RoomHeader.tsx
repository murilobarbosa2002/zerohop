import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { COMMON_STRINGS } from '@/strings/common.strings';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomHeaderProps } from '@/components/Room/RoomHeader.types';

export function RoomHeader({ roomCode, roomPassword, onLeave }: RoomHeaderProps) {
  return (
    <Card>
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2.5 bg-panel-2 border border-border rounded-full pl-3.5 pr-1.5 py-1.5">
            {ROOM_STRINGS.roomCodeLabel} <span className="font-mono font-bold tracking-wide text-accent">{roomCode}</span>
            <button
              onClick={() => navigator.clipboard.writeText(roomCode)}
              className="bg-accent-soft text-accent rounded-full px-3 py-1.5 text-xs font-bold hover:brightness-110"
            >
              {COMMON_STRINGS.copyButton}
            </button>
          </div>
          {roomPassword && (
            <div className="flex items-center gap-2.5 bg-panel-2 border border-border rounded-full pl-3.5 pr-1.5 py-1.5">
              {ROOM_STRINGS.roomPasswordLabel} <span className="font-mono font-bold tracking-wide text-accent">{roomPassword}</span>
              <button
                onClick={() => navigator.clipboard.writeText(roomPassword)}
                className="bg-accent-soft text-accent rounded-full px-3 py-1.5 text-xs font-bold hover:brightness-110"
              >
                {COMMON_STRINGS.copyButton}
              </button>
            </div>
          )}
        </div>
        <ActionButton variant="danger" onClick={onLeave}>
          {ROOM_STRINGS.leaveRoomButton}
        </ActionButton>
      </div>
    </Card>
  );
}
