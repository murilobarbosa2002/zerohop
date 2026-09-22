import { tv } from '@/lib/tv';

export const navItemVariants = tv({
  base: 'text-left px-3.5 py-2.5 rounded-lg text-body-sm',
  variants: {
    active: {
      true: 'bg-accent-soft text-accent font-semibold',
      false: 'text-text-dim hover:bg-panel-2'
    }
  }
});
