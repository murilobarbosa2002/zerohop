import type { CaptureSource } from '@shared/ipc-types';

declare global {
  interface Window {
    api: {
      getSources: () => Promise<CaptureSource[]>;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

export {};
