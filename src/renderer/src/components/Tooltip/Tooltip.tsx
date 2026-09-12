import type { TooltipProps } from '@/components/Tooltip/Tooltip.types';

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-panel border border-border px-2 py-1 text-badge-xs text-text opacity-0 scale-95 transition-all group-hover:opacity-100 group-hover:scale-100 z-20">
        {label}
      </span>
    </span>
  );
}
