import type { RangeSliderProps } from '@/components/RangeSlider/RangeSlider.types';

export function RangeSlider({ value, min, max, step, onChange }: RangeSliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="flex-1 accent-accent cursor-pointer"
    />
  );
}
