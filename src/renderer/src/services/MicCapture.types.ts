export interface MicCaptureHandle {
  stream: MediaStream;
  setGain: (gain: number) => void;
  stop: () => void;
}
