import { Tooltip } from '@/components/Tooltip';
import { MicIcon, SpeakerIcon, LogsIcon, SettingsIcon } from '@/components/icons';
import { roomToolbarButtonVariants } from '@/components/Room/RoomToolbar.variants';
import { playOpenLogsSound, playOpenSettingsSound } from '@/services/soundEffects';
import { ROOM_STRINGS } from '@/strings/room.strings';
import { TITLE_BAR_STRINGS } from '@/strings/titleBar.strings';
import type { RoomToolbarProps } from '@/components/Room/RoomToolbar.types';

export function RoomToolbar({ micMuted, deafened, onToggleMic, onToggleDeafen, onOpenLogs, onOpenSettings }: RoomToolbarProps) {
  const micLabel = micMuted ? ROOM_STRINGS.unmuteMicButton : ROOM_STRINGS.muteMicButton;
  const deafenLabel = deafened ? ROOM_STRINGS.undeafenButton : ROOM_STRINGS.deafenButton;

  return (
    <div className="flex items-center justify-center gap-2 bg-panel border border-border rounded-lg px-3 py-2">
      <Tooltip label={micLabel}>
        <button onClick={onToggleMic} aria-label={micLabel} className={roomToolbarButtonVariants({ tone: micMuted ? 'danger' : 'default' })}>
          <MicIcon muted={micMuted} />
        </button>
      </Tooltip>
      <Tooltip label={deafenLabel}>
        <button onClick={onToggleDeafen} aria-label={deafenLabel} className={roomToolbarButtonVariants({ tone: deafened ? 'danger' : 'default' })}>
          <SpeakerIcon muted={deafened} />
        </button>
      </Tooltip>
      <Tooltip label={TITLE_BAR_STRINGS.logsButtonLabel}>
        <button
          onClick={() => {
            playOpenLogsSound();
            onOpenLogs();
          }}
          aria-label={TITLE_BAR_STRINGS.logsButtonLabel}
          className={roomToolbarButtonVariants()}
        >
          <LogsIcon />
        </button>
      </Tooltip>
      <Tooltip label={TITLE_BAR_STRINGS.settingsButtonLabel}>
        <button
          onClick={() => {
            playOpenSettingsSound();
            onOpenSettings();
          }}
          aria-label={TITLE_BAR_STRINGS.settingsButtonLabel}
          className={roomToolbarButtonVariants()}
        >
          <SettingsIcon />
        </button>
      </Tooltip>
    </div>
  );
}
