import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { VoiceControlsProps } from '@/components/Room/VoiceControls.types';

export function VoiceControls({ micMuted, deafened, onToggleMic, onToggleDeafen }: VoiceControlsProps) {
  return (
    <Card>
      <div className="flex gap-2">
        <ActionButton variant={micMuted ? 'danger' : 'default'} className="flex-1" onClick={onToggleMic}>
          {micMuted ? `🔇 ${ROOM_STRINGS.unmuteMicButton}` : `🎤 ${ROOM_STRINGS.muteMicButton}`}
        </ActionButton>
        <ActionButton variant={deafened ? 'danger' : 'default'} className="flex-1" onClick={onToggleDeafen}>
          {deafened ? `🔇 ${ROOM_STRINGS.undeafenButton}` : `🔊 ${ROOM_STRINGS.deafenButton}`}
        </ActionButton>
      </div>
    </Card>
  );
}
