import type { RefObject } from 'react';

export interface ShareActiveStatusProps {
  status: string;
  onStop: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
  localStream: MediaStream | null;
}
