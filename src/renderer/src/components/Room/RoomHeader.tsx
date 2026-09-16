import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { CopyButton } from '@/components/CopyButton';
import { HouseIcon, BoltIcon } from '@/components/icons';
import { getRoomKind } from '@/services/roomKind';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomHeaderProps } from '@/components/Room/RoomHeader.types';

export function RoomHeader({ roomCode, roomPassword, onLeave }: RoomHeaderProps) {
  const roomKind = getRoomKind(roomCode);

  return (
    <Card>
      <div className="flex flex-col gap-2">
        {roomKind !== 'normal' && (
          <div className="flex items-center gap-1.5 text-body-xs font-bold text-text-dim">
            {roomKind === 'personal' ? <HouseIcon className="w-3 h-3" /> : <BoltIcon className="w-3 h-3" />}
            {roomKind === 'personal' ? ROOM_STRINGS.personalRoomIndicatorLabel : ROOM_STRINGS.autoRoomIndicatorLabel}
          </div>
        )}
        <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0">
          <span className="text-body-xs text-text-dim block mb-1">{ROOM_STRINGS.roomCodeLabel}</span>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="font-mono font-bold tracking-wide text-accent truncate">{roomCode}</span>
            <CopyButton text={roomCode} />
          </div>
        </div>
        {roomPassword && (
          <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0">
            <span className="text-body-xs text-text-dim block mb-1">{ROOM_STRINGS.roomPasswordLabel}</span>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="font-mono font-bold tracking-wide text-accent truncate">{roomPassword}</span>
              <CopyButton text={roomPassword} />
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
