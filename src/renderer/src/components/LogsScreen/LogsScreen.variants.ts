import { tv } from '@/lib/tv';

export const categoryPillVariants = tv({
  base: 'px-3 py-1.5 rounded-full text-body-sm flex-shrink-0',
  variants: {
    active: {
      true: 'bg-accent-soft text-accent font-semibold',
      false: 'text-text-dim bg-panel-2 hover:border-accent border border-border'
    }
  }
});

export const logLevelDotVariants = tv({
  base: 'w-status-dot-size h-status-dot-size rounded-full flex-shrink-0 mt-1',
  variants: {
    level: {
      info: 'bg-success',
      warning: 'bg-warn',
      error: 'bg-danger'
    }
  }
});
