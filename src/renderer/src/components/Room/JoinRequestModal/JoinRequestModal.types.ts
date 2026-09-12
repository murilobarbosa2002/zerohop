import type { JoinRequestEntry } from '@/services/RoomClient';

export interface JoinRequestModalProps {
  requests: JoinRequestEntry[];
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}
