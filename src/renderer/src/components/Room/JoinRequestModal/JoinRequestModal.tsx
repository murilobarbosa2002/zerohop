import { JoinRequestOverlay } from '@/components/Room/JoinRequestModal/JoinRequestOverlay';
import type { JoinRequestModalProps } from '@/components/Room/JoinRequestModal/JoinRequestModal.types';

export function JoinRequestModal({ requests, onApprove, onDeny }: JoinRequestModalProps) {
  return requests.length === 0 ? null : <JoinRequestOverlay requests={requests} onApprove={onApprove} onDeny={onDeny} />;
}
