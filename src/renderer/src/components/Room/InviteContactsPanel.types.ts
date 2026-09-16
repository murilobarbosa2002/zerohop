import type { Contact } from '@shared/contact';
import type { MemberSnapshot } from '@/services/room/MemberRegistry';

export interface InviteContactsPanelProps {
  contacts: Contact[];
  members: MemberSnapshot[];
  hasContactJoinedViaInvite: (contactId: string) => boolean;
  onInvite: (contact: Contact) => void;
}
