export interface RoomToolbarProps {
  micMuted: boolean;
  deafened: boolean;
  onToggleMic: () => void;
  onToggleDeafen: () => void;
  onOpenLogs: () => void;
  onOpenSettings: () => void;
}
