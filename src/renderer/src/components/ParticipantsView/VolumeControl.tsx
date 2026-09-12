import { RangeSlider } from '@/components/RangeSlider';
import { SpeakerIcon } from '@/components/icons';
import { MIN_VOLUME_PERCENT, MAX_VOLUME_PERCENT } from '@/constants/volume';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import type { VolumeControlProps } from '@/components/ParticipantsView/VolumeControl.types';

export function VolumeControl({ muted, volume, onToggleMute, onChangeVolume }: VolumeControlProps) {
  const label = muted ? PARTICIPANTS_STRINGS.unmuteButtonLabel : PARTICIPANTS_STRINGS.muteButtonLabel;

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={onToggleMute}
        title={label}
        aria-label={label}
        className="bg-panel-2 border border-border text-text rounded-lg w-volume-button-size h-volume-button-size flex items-center justify-center hover:border-accent flex-shrink-0"
      >
        <SpeakerIcon muted={muted} />
      </button>
      <RangeSlider
        min={MIN_VOLUME_PERCENT}
        max={MAX_VOLUME_PERCENT}
        value={Math.round(volume * MAX_VOLUME_PERCENT)}
        onChange={(value) => onChangeVolume(value / MAX_VOLUME_PERCENT)}
      />
    </div>
  );
}
