import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { JoinRequestModalProps } from '@/components/Room/JoinRequestModal/JoinRequestModal.types';

export function JoinRequestOverlay({ requests, onApprove, onDeny }: JoinRequestModalProps) {
  const [current, ...rest] = requests;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4">
      <div className="w-full max-w-modal">
        <Card>
          <p className="font-bold text-body-sm-alt">{ROOM_STRINGS.joinRequestTitle(current.name)}</p>
          <p className="text-text-dim text-xs mt-1.5">{ROOM_STRINGS.joinRequestHint}</p>
          {rest.length > 0 && <p className="text-text-dim text-xs mt-1.5">{ROOM_STRINGS.joinRequestQueueHint(rest.length)}</p>}
          <div className="flex gap-2 mt-3.5">
            <ActionButton variant="danger" className="flex-1" onClick={() => onDeny(current.id)}>
              {ROOM_STRINGS.joinRequestDenyButton}
            </ActionButton>
            <ActionButton variant="primary" className="flex-1" onClick={() => onApprove(current.id)}>
              {ROOM_STRINGS.joinRequestApproveButton}
            </ActionButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
