import type { RoomClient } from '@/services/RoomClient';
import type { SourcePickerState } from '@/hooks/useSourcePicker.types';
import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface RoomStageProps {
  roomClient: RoomClient;
  sourcePicker: SourcePickerState;
  sharing: boolean;
  members: MemberSnapshot[];
  panelOpen: boolean;
  onSetPanelOpen: (open: boolean) => void;
}

export interface StageVideoAreaProps {
  members: MemberSnapshot[];
}
