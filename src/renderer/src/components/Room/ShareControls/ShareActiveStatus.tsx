import { useState } from 'react';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { SelfPreviewLightbox } from '@/components/Room/ShareControls/SelfPreviewLightbox';
import { playShareEditSound } from '@/services/soundEffects';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { ShareActiveStatusProps } from '@/components/Room/ShareControls/ShareActiveStatus.types';

export function ShareActiveStatus({ status, onStop, onEdit, videoRef, localStream }: ShareActiveStatusProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3.5">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          title={ROOM_STRINGS.enlargePreviewHint}
          className="relative flex-shrink-0 group"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-self-preview-width h-self-preview-height bg-black rounded-lg border border-border block"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-bg/0 group-hover:bg-bg/60 text-transparent group-hover:text-text text-xs font-semibold transition-colors">
            {ROOM_STRINGS.enlargePreviewHint}
          </span>
        </button>
        {lightboxOpen && <SelfPreviewLightbox stream={localStream} onClose={() => setLightboxOpen(false)} />}
        <div className="flex-1 min-w-form-column">
          <p className="font-bold text-body-sm-alt flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {ROOM_STRINGS.sharingActiveLabel}
          </p>
          {status && <p className="text-text-dim text-xs mt-1">{status}</p>}
        </div>
        <ActionButton
          variant="default"
          onClick={() => {
            playShareEditSound();
            onEdit();
          }}
        >
          {ROOM_STRINGS.editSharingButton}
        </ActionButton>
        <ActionButton variant="danger" onClick={onStop}>
          {ROOM_STRINGS.stopSharingButton}
        </ActionButton>
      </div>
    </Card>
  );
}
