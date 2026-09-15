import type { PreRoomChoiceOptionProps } from '@/components/PreRoom/PreRoomChoiceOption.types';

export function PreRoomChoiceOption({ icon, title, hint, primary, onClick }: PreRoomChoiceOptionProps) {
  return (
    <button
      type="button"
      aria-label={title}
      onClick={onClick}
      className={
        primary
          ? 'w-full flex items-center gap-3 text-left px-4 py-3 rounded-button border border-transparent bg-gradient-to-br from-accent to-accent-2 hover:brightness-105 transition-colors active:scale-[0.99]'
          : 'w-full flex items-center gap-3 text-left px-4 py-3 rounded-button border border-border bg-panel-2 hover:border-accent hover:bg-hover-panel transition-colors active:scale-[0.99]'
      }
    >
      <span
        className={
          primary
            ? 'w-9 h-9 rounded-full bg-white/15 text-text-on-accent flex items-center justify-center flex-shrink-0'
            : 'w-9 h-9 rounded-full bg-accent-soft text-accent flex items-center justify-center flex-shrink-0'
        }
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className={`block font-bold text-body-sm ${primary ? 'text-text-on-accent' : 'text-text'}`}>{title}</span>
        <span className={`block text-xs mt-0.5 leading-relaxed ${primary ? 'text-text-on-accent opacity-90' : 'text-text-dim'}`}>
          {hint}
        </span>
      </span>
    </button>
  );
}
