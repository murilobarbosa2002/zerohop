import { tv } from 'tailwind-variants';

export const roomToolbarButtonVariants = tv({
  base: 'rounded-lg w-volume-button-size h-volume-button-size text-body-sm flex items-center justify-center flex-shrink-0 border',
  variants: {
    tone: {
      default: 'bg-panel-2 border-border text-text hover:border-accent',
      danger: 'bg-danger/15 border-danger text-danger',
      success: 'bg-success/15 border-success text-success'
    }
  },
  defaultVariants: {
    tone: 'default'
  }
});
