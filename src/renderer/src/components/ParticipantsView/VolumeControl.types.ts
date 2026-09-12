export interface VolumeControlProps {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onChangeVolume: (volume: number) => void;
}
