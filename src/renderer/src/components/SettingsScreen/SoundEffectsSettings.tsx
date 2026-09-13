import { RangeSlider } from '@/components/RangeSlider';
import { useSoundEffectsVolume } from '@/hooks/useSoundEffectsVolume';
import { MIN_SOUND_EFFECTS_VOLUME, MAX_SOUND_EFFECTS_VOLUME, SOUND_EFFECTS_VOLUME_STEP } from '@/constants/soundEffects';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';

export function SoundEffectsSettings() {
  const [volume, setVolume] = useSoundEffectsVolume();

  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.soundEffectsTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.soundEffectsHint}</p>

      <div className="flex items-center gap-2 mt-3.5">
        <RangeSlider
          min={MIN_SOUND_EFFECTS_VOLUME}
          max={MAX_SOUND_EFFECTS_VOLUME}
          step={SOUND_EFFECTS_VOLUME_STEP}
          value={volume}
          onChange={setVolume}
        />
        <span className="text-text-dim text-xs w-10 text-right">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}
