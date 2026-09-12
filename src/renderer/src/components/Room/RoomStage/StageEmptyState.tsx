import { ROOM_STRINGS } from '@/strings/room.strings';

export function StageEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-1.5 py-10">
      <p className="font-bold text-body-sm-alt">{ROOM_STRINGS.stageEmptyTitle}</p>
      <p className="text-text-dim text-xs">{ROOM_STRINGS.stageEmptyHint}</p>
    </div>
  );
}
