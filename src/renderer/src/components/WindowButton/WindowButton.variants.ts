import { tv } from '@/lib/tv';

export const windowButtonVariants = tv({
  base: 'w-window-button-width h-full flex items-center justify-center text-text-dim transition-colors [-webkit-app-region:no-drag]',
  variants: {
    danger: {
      true: 'hover:bg-hover-danger-border hover:text-text-on-accent',
      false: 'hover:bg-panel-2 hover:text-text'
    }
  },
  defaultVariants: {
    danger: false
  }
});
