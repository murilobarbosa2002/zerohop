import { InviteReceivedOverlay } from '@/components/InviteReceivedModal/InviteReceivedOverlay';
import type { InviteReceivedModalProps } from '@/components/InviteReceivedModal/InviteReceivedModal.types';

export function InviteReceivedModal({ invites, onAccept, onDecline }: InviteReceivedModalProps) {
  return invites.length === 0 ? null : <InviteReceivedOverlay invites={invites} onAccept={onAccept} onDecline={onDecline} />;
}
