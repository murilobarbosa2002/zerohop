import { Card, CardTitle } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import type { PreRoomChoiceProps } from '@/components/PreRoom/PreRoom.types';

export function PreRoomChoice({ onSelectCreate, onSelectJoin }: PreRoomChoiceProps) {
  return (
    <Card>
      <CardTitle>{PRE_ROOM_STRINGS.choiceTitle}</CardTitle>
      <div className="flex gap-4 flex-wrap">
        <ActionButton type="button" variant="primary" className="flex-1 min-w-form-column" onClick={onSelectCreate}>
          {PRE_ROOM_STRINGS.createRoomButton}
        </ActionButton>
        <ActionButton type="button" variant="default" className="flex-1 min-w-form-column" onClick={onSelectJoin}>
          {PRE_ROOM_STRINGS.joinRoomButton}
        </ActionButton>
      </div>
    </Card>
  );
}
