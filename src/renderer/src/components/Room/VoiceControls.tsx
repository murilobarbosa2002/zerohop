import { Tooltip } from '@/components/Tooltip';
import { voiceControlButtonVariants } from '@/components/Room/VoiceControls.variants';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { VoiceControlsProps } from '@/components/Room/VoiceControls.types';

function MicIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <rect x="4" y="1" width="4" height="6" rx="2" />
      <path d="M2.5 6.5a3.5 3.5 0 0 0 7 0" />
      <line x1="6" y1="9.5" x2="6" y2="11" />
      <line x1="4" y1="11" x2="8" y2="11" />
      {muted && <line x1="1.5" y1="10.5" x2="10.5" y2="1.5" />}
    </svg>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4.5h1.8L6 2v8L2.8 7.5H1z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="M8 4.5l3 3M11 4.5l-3 3" />
      ) : (
        <path d="M7.8 4a3 3 0 0 1 0 4" />
      )}
    </svg>
  );
}

export function VoiceControls({ micMuted, deafened, onToggleMic, onToggleDeafen }: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2">
      <Tooltip label={micMuted ? ROOM_STRINGS.unmuteMicButton : ROOM_STRINGS.muteMicButton}>
        <button onClick={onToggleMic} className={voiceControlButtonVariants({ active: micMuted })}>
          <MicIcon muted={micMuted} />
        </button>
      </Tooltip>
      <Tooltip label={deafened ? ROOM_STRINGS.undeafenButton : ROOM_STRINGS.deafenButton}>
        <button onClick={onToggleDeafen} className={voiceControlButtonVariants({ active: deafened })}>
          <SpeakerIcon muted={deafened} />
        </button>
      </Tooltip>
    </div>
  );
}
