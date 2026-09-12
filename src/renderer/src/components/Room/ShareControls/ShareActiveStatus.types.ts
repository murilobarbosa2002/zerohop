import type { RefObject } from 'react';

export interface ShareActiveStatusProps {
  status: string;
  onStop: () => void;
  onEdit: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
  localStream: MediaStream | null;
}
