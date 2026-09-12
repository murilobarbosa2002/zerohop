import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { COMMON_STRINGS } from '@/strings/common.strings';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomHeaderProps } from '@/components/Room/RoomHeader.types';

export function RoomHeader({ roomCode, roomPassword, onLeave }: RoomHeaderProps) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0">
          <span className="text-body-xs text-text-dim block mb-1">{ROOM_STRINGS.roomCodeLabel}</span>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="font-mono font-bold tracking-wide text-accent truncate">{roomCode}</span>
            <button
              onClick={() => navigator.clipboard.writeText(roomCode)}
              className="bg-accent-soft text-accent rounded-full px-2.5 py-1 text-badge-xs font-bold hover:brightness-110 flex-shrink-0"
            >
              {COMMON_STRINGS.copyButton}
            </button>
          </div>
        </div>
        {roomPassword && (
          <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0">
            <span className="text-body-xs text-text-dim block mb-1">{ROOM_STRINGS.roomPasswordLabel}</span>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="font-mono font-bold tracking-wide text-accent truncate">{roomPassword}</span>
              <button
                onClick={() => navigator.clipboard.writeText(roomPassword)}
                className="bg-accent-soft text-accent rounded-full px-2.5 py-1 text-badge-xs font-bold hover:brightness-110 flex-shrink-0"
              >
                {COMMON_STRINGS.copyButton}
              </button>
            </div>
          </div>
        )}
        <ActionButton variant="danger" onClick={onLeave}>
          {ROOM_STRINGS.leaveRoomButton}
        </ActionButton>
      </div>
    </Card>
  );
}
