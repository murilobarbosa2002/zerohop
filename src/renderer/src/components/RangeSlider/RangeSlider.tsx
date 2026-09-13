import type { RangeSliderProps } from '@/components/RangeSlider/RangeSlider.types';

const FILL_COLOR = '#000080';
const TRACK_COLOR = '#c0c0c0';

export function RangeSlider({ value, min, max, step, onChange }: RangeSliderProps) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="flex-1 accent-accent cursor-pointer"
      style={{ background: `linear-gradient(to right, ${FILL_COLOR} ${percent}%, ${TRACK_COLOR} ${percent}%)` }}
    />
  );
}
