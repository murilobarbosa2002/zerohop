import { PreRoom } from '@/components/PreRoom';
import { ActionButton } from '@/components/ActionButton';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import type { AddRoomOverlayProps } from '@/components/AddRoomOverlay/AddRoomOverlay.types';

export function AddRoomOverlay({ roomClient, onEntered, onCancel, findSessionByRoomCode }: AddRoomOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-bg overflow-y-auto px-7 py-7">
      <div className="flex items-center gap-3 mb-4">
        <ActionButton variant="default" onClick={onCancel}>
          {PRE_ROOM_STRINGS.backButton}
        </ActionButton>
      </div>
      <PreRoom roomClient={roomClient} onEntered={onEntered} findSessionByRoomCode={findSessionByRoomCode} />
    </div>
  );
}
