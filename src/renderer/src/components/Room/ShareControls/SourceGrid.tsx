import { ROOM_STRINGS } from '@/strings/room.strings';
import { sourceCardVariants } from '@/components/Room/ShareControls/SourceGrid.variants';
import { getCaptureSourceKind } from '@/lib/captureSourceKind';
import { CaptureSourceKind } from '@/constants/captureSourceKind';
import type { SourceGridProps } from '@/components/Room/ShareControls/SourceGrid.types';

export function SourceGrid({ sources, selectedId, onSelect }: SourceGridProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-3">
      {sources.map((source) => {
        const isWindowSource = getCaptureSourceKind(source.id) === CaptureSourceKind.WINDOW;
        const selected = source.id === selectedId;
        return (
          <button key={source.id} onClick={() => onSelect(source.id)} className={sourceCardVariants({ selected })}>
            <span className="inline-block mb-1 text-label-xs font-bold uppercase tracking-wide text-accent bg-accent-soft rounded-full px-1.5 py-0.5">
              {isWindowSource ? ROOM_STRINGS.windowSourceKind : ROOM_STRINGS.screenSourceKind}
            </span>
            <img
              src={source.thumbnail}
              decoding="sync"
              loading="eager"
              className="w-full h-source-thumbnail-height object-cover rounded-md block bg-black"
            />
            <span className="block text-body-xs mt-1.5 text-text-dim break-words">{source.name}</span>
          </button>
        );
      })}
    </div>
  );
}
