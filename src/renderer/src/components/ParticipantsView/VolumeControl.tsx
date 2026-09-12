import { MIN_VOLUME_PERCENT, MAX_VOLUME_PERCENT } from '@/constants/volume';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import type { VolumeControlProps } from '@/components/ParticipantsView/VolumeControl.types';

export function VolumeControl({ muted, volume, onToggleMute, onChangeVolume }: VolumeControlProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={onToggleMute}
        title={muted ? PARTICIPANTS_STRINGS.unmuteButtonLabel : PARTICIPANTS_STRINGS.muteButtonLabel}
        className="bg-panel-2 border border-border text-text rounded-lg w-volume-button-size h-volume-button-size text-body-sm hover:border-accent flex-shrink-0"
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <input
        type="range"
        min={MIN_VOLUME_PERCENT}
        max={MAX_VOLUME_PERCENT}
        value={Math.round(volume * MAX_VOLUME_PERCENT)}
        onChange={(event) => onChangeVolume(Number(event.target.value) / MAX_VOLUME_PERCENT)}
        className="flex-1 accent-accent cursor-pointer"
      />
    </div>
  );
}
