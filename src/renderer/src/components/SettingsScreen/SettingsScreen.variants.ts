import { tv } from '@/lib/tv';

export const settingsCategoryTabVariants = tv({
  base: 'text-left px-3 py-2 rounded-lg text-body-sm font-bold border transition-colors',
  variants: {
    active: {
      true: 'bg-gradient-to-br from-accent to-accent-2 border-transparent text-text-on-accent',
      false: 'bg-transparent border-transparent text-text-dim hover:bg-hover-panel hover:text-text'
    }
  },
  defaultVariants: {
    active: false
  }
});
