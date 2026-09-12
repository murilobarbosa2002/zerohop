export interface RoomToolbarProps {
  micMuted: boolean;
  deafened: boolean;
  onToggleMic: () => void;
  onToggleDeafen: () => void;
  sharing: boolean;
  onToggleSharePanel: () => void;
  onOpenSettings: () => void;
}
