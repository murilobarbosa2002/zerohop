import type { Resolution } from '@/constants/resolution';
import type { Fps } from '@/constants/fps';
import type { SourcePickerState } from '@/hooks/useSourcePicker.types';
import type { SelectOption } from '@/components/SelectField';

export interface ShareSourcePickerProps {
  sourcePicker: SourcePickerState;
  resolution: Resolution;
  onChangeResolution: (resolution: Resolution) => void;
  fps: Fps;
  onChangeFps: (fps: Fps) => void;
  audioSelection: string;
  onChangeAudioSelection: (value: string) => void;
  audioOptions: SelectOption[];
  status: string;
  onConfirm: () => void;
  onCancel: () => void;
}
