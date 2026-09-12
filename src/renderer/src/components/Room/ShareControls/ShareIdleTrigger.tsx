import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { ShareIdleTriggerProps } from '@/components/Room/ShareControls/ShareIdleTrigger.types';

export function ShareIdleTrigger({ onOpen }: ShareIdleTriggerProps) {
  return (
    <Card>
      <ActionButton variant="primary" className="w-full" onClick={onOpen}>
        {ROOM_STRINGS.startSharingButton}
      </ActionButton>
    </Card>
  );
}
