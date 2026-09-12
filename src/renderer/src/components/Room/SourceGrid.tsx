import { ROOM_STRINGS } from '@/strings/room.strings';
import { sourceCardVariants } from '@/components/Room/SourceGrid.variants';
import type { SourceGridProps } from '@/components/Room/SourceGrid.types';

const WINDOW_SOURCE_ID_PREFIX = 'window:';

export function SourceGrid({ sources, selectedId, onSelect }: SourceGridProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-3">
      {sources.map((source) => {
        const isWindowSource = source.id.startsWith(WINDOW_SOURCE_ID_PREFIX);
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
