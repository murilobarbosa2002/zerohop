import { RangeSlider } from '@/components/RangeSlider';
import { useUiScale } from '@/hooks/useUiScale';
import { MIN_UI_SCALE, MAX_UI_SCALE, UI_SCALE_STEP } from '@/constants/uiScale';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';

export function UiScaleSettings() {
  const [scale, setScale] = useUiScale();

  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.uiScaleTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.uiScaleHint}</p>

      <div className="flex items-center gap-2 mt-3.5">
        <RangeSlider min={MIN_UI_SCALE} max={MAX_UI_SCALE} step={UI_SCALE_STEP} value={scale} onChange={setScale} />
        <span className="text-text-dim text-xs w-10 text-right">{Math.round(scale * 100)}%</span>
      </div>
    </div>
  );
}
