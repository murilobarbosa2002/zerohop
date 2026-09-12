import { ShareControls } from '@/components/Room/ShareControls';
import { StageVideoArea } from '@/components/Room/RoomStage/StageVideoArea';
import type { RoomStageProps } from '@/components/Room/RoomStage/RoomStage.types';

export function RoomStage({ roomClient, sourcePicker, sharing, members }: RoomStageProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto px-1">
      <ShareControls roomClient={roomClient} sourcePicker={sourcePicker} sharing={sharing} />
      <StageVideoArea members={members} />
    </div>
  );
}
