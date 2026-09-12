import { voiceControlButtonVariants } from '@/components/Room/VoiceControls.variants';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { VoiceControlsProps } from '@/components/Room/VoiceControls.types';

export function VoiceControls({ micMuted, deafened, onToggleMic, onToggleDeafen }: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2">
      <button
        onClick={onToggleMic}
        title={micMuted ? ROOM_STRINGS.unmuteMicButton : ROOM_STRINGS.muteMicButton}
        className={voiceControlButtonVariants({ active: micMuted })}
      >
        {micMuted ? '🔇' : '🎤'}
      </button>
      <button
        onClick={onToggleDeafen}
        title={deafened ? ROOM_STRINGS.undeafenButton : ROOM_STRINGS.deafenButton}
        className={voiceControlButtonVariants({ active: deafened })}
      >
        {deafened ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
