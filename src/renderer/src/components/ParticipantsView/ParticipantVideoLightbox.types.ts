export interface ParticipantVideoLightboxProps {
  stream: MediaStream;
  volume: number;
  muted: boolean;
  onClose: () => void;
}
