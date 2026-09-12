import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { ShareActiveStatusProps } from '@/components/Room/ShareActiveStatus.types';

export function ShareActiveStatus({ status, onStop, videoRef }: ShareActiveStatusProps) {
  return (
    <Card>
      <div className="flex items-center gap-3.5">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-self-preview-width h-self-preview-height bg-black rounded-lg border border-border block flex-shrink-0"
        />
        <div className="flex-1">
          <p className="font-bold text-body-sm-alt flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {ROOM_STRINGS.sharingActiveLabel}
          </p>
          {status && <p className="text-text-dim text-xs mt-1">{status}</p>}
        </div>
        <ActionButton variant="danger" onClick={onStop}>
          {ROOM_STRINGS.stopSharingButton}
        </ActionButton>
      </div>
    </Card>
  );
}
