import { Tooltip } from '@/components/Tooltip';
import { MicIcon, SpeakerIcon } from '@/components/icons';
import { roomToolbarButtonVariants } from '@/components/Room/RoomToolbar.variants';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { RoomToolbarProps } from '@/components/Room/RoomToolbar.types';

export function RoomToolbar({ micMuted, deafened, pushToTalkActive, pushToTalkConfigured, onToggleMic, onToggleDeafen }: RoomToolbarProps) {
  const micLabel = micMuted ? ROOM_STRINGS.unmuteMicButton : ROOM_STRINGS.muteMicButton;
  const deafenLabel = deafened ? ROOM_STRINGS.undeafenButton : ROOM_STRINGS.deafenButton;
  const micIdleFromPushToTalk = pushToTalkConfigured && micMuted && !pushToTalkActive;
  const micTone = pushToTalkActive ? 'success' : micMuted && !micIdleFromPushToTalk ? 'danger' : 'default';

  return (
    <div className="flex items-center justify-center gap-2 bg-panel border border-border rounded-lg px-3 py-2">
      <Tooltip label={micLabel}>
        <button onClick={onToggleMic} aria-label={micLabel} className={roomToolbarButtonVariants({ tone: micTone })}>
          <MicIcon muted={micMuted} />
        </button>
      </Tooltip>
      {pushToTalkActive && <span className="text-success text-badge-xs font-bold">{ROOM_STRINGS.pushToTalkSpeakingLabel}</span>}
      <Tooltip label={deafenLabel}>
        <button
          onClick={onToggleDeafen}
          aria-label={deafenLabel}
          className={roomToolbarButtonVariants({ tone: deafened ? 'danger' : 'default' })}
        >
          <SpeakerIcon muted={deafened} />
        </button>
      </Tooltip>
    </div>
  );
}
