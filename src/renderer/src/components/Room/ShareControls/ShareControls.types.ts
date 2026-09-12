import type { RoomClient } from '@/services/RoomClient';
import type { SourcePickerState } from '@/hooks/useSourcePicker.types';

export interface ShareControlsProps {
  roomClient: RoomClient;
  sourcePicker: SourcePickerState;
  sharing: boolean;
}
