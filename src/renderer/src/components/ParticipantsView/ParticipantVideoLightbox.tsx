import { useEffect, useRef } from 'react';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { ParticipantVideoLightboxProps } from '@/components/ParticipantsView/ParticipantVideoLightbox.types';

export function ParticipantVideoLightbox({ stream, volume, muted, onClose }: ParticipantVideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current.volume = volume;
    videoRef.current.muted = muted;
  }, [stream, volume, muted]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-bg/90 px-4" onClick={onClose}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-preview-lightbox-width aspect-video bg-black rounded-lg border border-border"
        onClick={(event) => event.stopPropagation()}
      />
      <p className="text-text-dim text-xs">{ROOM_STRINGS.closePreviewHint}</p>
    </div>
  );
}
