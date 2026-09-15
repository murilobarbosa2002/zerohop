import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { InviteReceivedModalProps } from '@/components/InviteReceivedModal/InviteReceivedModal.types';

export function InviteReceivedOverlay({ invites, onAccept, onDecline }: InviteReceivedModalProps) {
  const [current, ...rest] = invites;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4">
      <div className="w-full max-w-modal">
        <Card>
          <p className="font-bold text-body-sm-alt">{ROOM_STRINGS.inviteReceivedTitle(current.hostName)}</p>
          <p className="text-text-dim text-xs mt-1.5">{ROOM_STRINGS.inviteReceivedHint}</p>
          {rest.length > 0 && <p className="text-text-dim text-xs mt-1.5">{ROOM_STRINGS.inviteReceivedQueueHint(rest.length)}</p>}
          <div className="flex gap-2 mt-3.5">
            <ActionButton variant="default" className="flex-1" onClick={() => onDecline(current.inviteId)}>
              {ROOM_STRINGS.inviteReceivedDeclineButton}
            </ActionButton>
            <ActionButton variant="primary" className="flex-1" onClick={() => onAccept(current.inviteId)}>
              {ROOM_STRINGS.inviteReceivedAcceptButton}
            </ActionButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
