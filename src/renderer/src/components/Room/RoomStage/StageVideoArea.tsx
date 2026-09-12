import { StageEmptyState } from '@/components/Room/RoomStage/StageEmptyState';
import { StageVideoGrid } from '@/components/Room/RoomStage/StageVideoGrid';
import type { StageVideoAreaProps } from '@/components/Room/RoomStage/RoomStage.types';

export function StageVideoArea({ members }: StageVideoAreaProps) {
  const watchedMembers = members.filter((member) => member.watching);
  return watchedMembers.length === 0 ? <StageEmptyState /> : <StageVideoGrid members={watchedMembers} />;
}
