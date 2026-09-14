import { useState } from 'react';
import { playScreenOpenSound, playScreenCloseSound } from '@/services/soundEffects';
import { Overlay } from '@/constants/overlay';

export interface UseOverlayResult {
  activeOverlay: Overlay | null;
  open: (overlay: Overlay) => void;
  toggle: (overlay: Overlay) => void;
  close: () => void;
}

export function useOverlay(): UseOverlayResult {
  const [activeOverlay, setActiveOverlay] = useState<Overlay | null>(null);

  function open(overlay: Overlay): void {
    playScreenOpenSound();
    setActiveOverlay(overlay);
  }

  function toggle(overlay: Overlay): void {
    setActiveOverlay((current) => {
      if (current === overlay) {
        playScreenCloseSound();
        return null;
      }
      playScreenOpenSound();
      return overlay;
    });
  }

  function close(): void {
    playScreenCloseSound();
    setActiveOverlay(null);
  }

  return { activeOverlay, open, toggle, close };
}
