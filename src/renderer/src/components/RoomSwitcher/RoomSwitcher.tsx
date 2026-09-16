import { HouseIcon, BoltIcon } from '@/components/icons';
import { getRoomKind } from '@/services/roomKind';
import { ROOM_SWITCHER_STRINGS } from '@/strings/roomSwitcher.strings';
import type { RoomSwitcherProps } from '@/components/RoomSwitcher/RoomSwitcher.types';

export function RoomSwitcher({ sessions, focusedSessionId, onFocus, onLeave, onAddRoom }: RoomSwitcherProps) {
  return (
    <div className="w-14 flex-shrink-0 border-r border-border flex flex-col items-center gap-2 py-3 overflow-y-auto">
      {sessions.map((session) => {
        const label = (session.roomCode ?? ROOM_SWITCHER_STRINGS.unnamedRoomLabel).slice(0, 2).toUpperCase();
        const isFocused = session.sessionId === focusedSessionId;
        const roomKind = getRoomKind(session.roomCode);
        const isPersonal = roomKind === 'personal';
        const isAuto = roomKind === 'auto';
        const badgeTooltip = isPersonal
          ? ROOM_SWITCHER_STRINGS.personalRoomBadgeTooltip
          : isAuto
            ? ROOM_SWITCHER_STRINGS.autoRoomBadgeTooltip
            : null;
        return (
          <div key={session.sessionId} className="relative group">
            <button
              onClick={() => onFocus(session.sessionId)}
              title={session.roomCode ?? undefined}
              className={`w-10 h-10 border flex items-center justify-center text-body-sm font-bold ${
                isFocused ? 'bg-accent text-text-on-accent' : 'bg-panel-2 text-text hover:border-accent'
              }`}
            >
              {label}
            </button>
            {badgeTooltip && (
              <span
                title={badgeTooltip}
                className={`absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center border border-bg ${
                  isPersonal ? 'bg-accent text-text-on-accent' : 'bg-warn text-text-on-accent'
                }`}
              >
                {isPersonal ? <HouseIcon /> : <BoltIcon />}
              </span>
            )}
            {session.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-danger text-text-on-accent text-[10px] font-bold flex items-center justify-center border border-bg">
                {session.unreadCount > 9 ? '9+' : session.unreadCount}
              </span>
            )}
            <button
              onClick={() => onLeave(session.sessionId)}
              title={ROOM_SWITCHER_STRINGS.leaveRoomTooltip}
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-danger text-text-on-accent text-[10px] font-bold items-center justify-center border border-bg hidden group-hover:flex"
            >
              ×
            </button>
          </div>
        );
      })}
      <button
        onClick={onAddRoom}
        title={ROOM_SWITCHER_STRINGS.addRoomButton}
        className="w-10 h-10 border bg-panel-2 text-text-dim hover:border-accent hover:text-text flex items-center justify-center text-lg font-bold flex-shrink-0"
      >
        +
      </button>
    </div>
  );
}
