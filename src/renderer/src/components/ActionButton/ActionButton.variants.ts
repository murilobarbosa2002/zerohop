import { tv } from '@/lib/tv';

export const actionButtonVariants = tv({
  base: 'rounded-button font-semibold border transition-colors active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    variant: {
      default: 'bg-panel-2 border-border text-text hover:border-accent hover:bg-hover-panel',
      primary: 'bg-gradient-to-br from-accent to-accent-2 border-transparent text-text-on-accent hover:brightness-105',
      danger: 'bg-panel-2 border-border text-text hover:border-hover-danger-border hover:bg-hover-danger-bg'
    },
    size: {
      default: 'px-3.5 py-2 mr-1 my-1 text-body-sm',
      compact: 'px-2 py-1 mr-0.5 my-0.5 text-body-xs'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});
