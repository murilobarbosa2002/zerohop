export interface MicCaptureHandle {
  stream: MediaStream;
  setGain: (gain: number) => void;
  setMuted: (muted: boolean) => void;
  stop: () => void;
}
