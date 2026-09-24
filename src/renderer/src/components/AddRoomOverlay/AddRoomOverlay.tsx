import { PreRoom } from '@/components/PreRoom';
import type { AddRoomOverlayProps } from '@/components/AddRoomOverlay/AddRoomOverlay.types';

export function AddRoomOverlay({
  roomClient,
  onEntered,
  initialScreen,
  onOpenUpdates,
  onOpenPersonalRoomSettings,
  onOpenProfile
}: AddRoomOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-bg overflow-y-auto px-7 py-7">
      <PreRoom
        roomClient={roomClient}
        onEntered={onEntered}
        initialScreen={initialScreen}
        onOpenUpdates={onOpenUpdates}
        onOpenPersonalRoomSettings={onOpenPersonalRoomSettings}
        onOpenProfile={onOpenProfile}
      />
    </div>
  );
}
