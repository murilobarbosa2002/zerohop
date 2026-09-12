import type { MemberSnapshot } from '@/services/room/MemberRegistry';
import type { MemberAudioStateStore } from '@/hooks/useMemberAudioState.types';

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
  onToggleMic: () => void;
  onToggleDeafen: () => void;
  voiceAudioState: MemberAudioStateStore;
  sharing: boolean;
  onToggleSharePanel: () => void;
  onOpenSettings: () => void;
}
