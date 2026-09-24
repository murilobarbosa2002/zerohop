import type { MemberSnapshot } from '@/services/room/MemberRegistry';
import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';
import type { Contact } from '@shared/contact';

export interface ParticipantTileProps {
  member: MemberSnapshot;
  onToggleWatch: (id: string) => void;
  canKick: boolean;
  onKick: (id: string) => void;
  voiceAudioState: MemberAudioStateStore;
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
  isWatchingMyScreen: boolean | null;
}
