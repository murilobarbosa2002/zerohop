import { Resolution, RESOLUTION_LABELS } from '@/constants/resolution';
import { Fps, FPS_LABELS } from '@/constants/fps';
import type { SelectOption } from '@/components/SelectField';

export const RESOLUTION_OPTIONS: SelectOption[] = Object.values(Resolution).map((value) => ({
  value,
  label: RESOLUTION_LABELS[value]
}));

export const FPS_OPTIONS: SelectOption[] = Object.values(Fps).map((value) => ({
  value,
  label: FPS_LABELS[value]
}));
