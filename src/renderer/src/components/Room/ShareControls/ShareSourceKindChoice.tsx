import { ActionButton } from '@/components/ActionButton';
import { CaptureSourceKind } from '@/constants/captureSourceKind';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { ShareSourceKindChoiceProps } from '@/components/Room/ShareControls/ShareSourceKindChoice.types';

export function ShareSourceKindChoice({ onSelect }: ShareSourceKindChoiceProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <ActionButton variant="primary" className="flex-1 min-w-form-column" onClick={() => onSelect(CaptureSourceKind.SCREEN)}>
        {ROOM_STRINGS.shareEntireScreenOption}
      </ActionButton>
      <ActionButton variant="default" className="flex-1 min-w-form-column" onClick={() => onSelect(CaptureSourceKind.WINDOW)}>
        {ROOM_STRINGS.shareSpecificWindowOption}
      </ActionButton>
      <p className="text-text-dim text-xs leading-relaxed basis-full mt-1">{ROOM_STRINGS.windowCaptureFocusHint}</p>
    </div>
  );
}
