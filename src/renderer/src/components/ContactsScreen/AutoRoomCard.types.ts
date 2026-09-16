import type { Contact } from '@shared/contact';

export interface AutoRoomCardProps {
  id: string;
  password: string;
  onChangePassword: (value: string) => void;
  contacts: Contact[];
  inviteContactIds: string[];
  onToggleInviteContact: (id: string) => void;
}
