import type { MemberSnapshot } from '@/services/room/MemberRegistry';
import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';
import type { Contact } from '@shared/contact';

export interface RoomSidebarProps {
  roomCode: string;
  roomPassword: string;
  members: MemberSnapshot[];
  canKick: boolean;
  onToggleWatch: (id: string) => void;
  onKick: (id: string) => void;
  onLeave: () => void;
  micMuted: boolean;
  deafened: boolean;
  pushToTalkActive: boolean;
  pushToTalkConfigured: boolean;
  onToggleMic: () => void;
  onToggleDeafen: () => void;
  voiceAudioState: MemberAudioStateStore;
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
  onInviteContact: (contact: Contact) => void;
  hasContactJoinedViaInvite: (contactId: string) => boolean;
}
