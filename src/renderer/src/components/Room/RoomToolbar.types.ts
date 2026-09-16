export interface RoomToolbarProps {
  micMuted: boolean;
  deafened: boolean;
  pushToTalkActive: boolean;
  pushToTalkConfigured: boolean;
  onToggleMic: () => void;
  onToggleDeafen: () => void;
  contactsPanelOpen: boolean;
  onToggleContactsPanel: () => void;
}
