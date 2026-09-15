import type { PendingInvite } from '@/hooks/useRoomSessions';

export interface InviteReceivedModalProps {
  invites: PendingInvite[];
  onAccept: (inviteId: string) => void;
  onDecline: (inviteId: string) => void;
}
