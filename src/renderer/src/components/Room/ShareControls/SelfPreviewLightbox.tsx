import { useEffect, useRef } from 'react';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { SelfPreviewLightboxProps } from '@/components/Room/ShareControls/SelfPreviewLightbox.types';

export function SelfPreviewLightbox({ stream, onClose }: SelfPreviewLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

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
        muted
        className="max-w-preview-lightbox-width max-h-lightbox-video w-auto h-auto bg-black rounded-lg border border-border"
        onClick={(event) => event.stopPropagation()}
      />
      <p className="text-text-dim text-xs">{ROOM_STRINGS.closePreviewHint}</p>
    </div>
  );
}
