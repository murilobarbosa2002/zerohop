import { RangeSlider } from '@/components/RangeSlider';
import { useSoundEffectsVolume } from '@/hooks/useSoundEffectsVolume';
import { SoundCategory, MIN_SOUND_EFFECTS_VOLUME, MAX_SOUND_EFFECTS_VOLUME, SOUND_EFFECTS_VOLUME_STEP } from '@/constants/soundEffects';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';

const CATEGORY_ROWS: { category: SoundCategory; label: string }[] = [
  { category: SoundCategory.INTERFACE, label: SETTINGS_STRINGS.soundCategoryInterfaceLabel },
  { category: SoundCategory.ROOM, label: SETTINGS_STRINGS.soundCategoryRoomLabel },
  { category: SoundCategory.CHAT, label: SETTINGS_STRINGS.soundCategoryChatLabel },
  { category: SoundCategory.VOICE, label: SETTINGS_STRINGS.soundCategoryVoiceLabel },
  { category: SoundCategory.SHARING, label: SETTINGS_STRINGS.soundCategorySharingLabel }
];

function CategoryRow({ category, label }: { category: SoundCategory; label: string }) {
  const [volume, setVolume] = useSoundEffectsVolume(category);

  return (
    <div className="flex items-center gap-2 mt-2.5">
      <span className="text-body-sm w-form-column flex-shrink-0">{label}</span>
      <RangeSlider min={MIN_SOUND_EFFECTS_VOLUME} max={MAX_SOUND_EFFECTS_VOLUME} step={SOUND_EFFECTS_VOLUME_STEP} value={volume} onChange={setVolume} />
      <span className="text-text-dim text-xs w-10 text-right">{Math.round(volume * 100)}%</span>
    </div>
  );
}

export function SoundEffectsSettings() {
  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.soundEffectsTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.soundEffectsHint}</p>

      {CATEGORY_ROWS.map((row) => (
        <CategoryRow key={row.category} category={row.category} label={row.label} />
      ))}
    </div>
  );
}
