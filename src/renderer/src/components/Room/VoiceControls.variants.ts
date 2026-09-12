import { tv } from 'tailwind-variants';

export const voiceControlButtonVariants = tv({
  base: 'rounded-lg w-volume-button-size h-volume-button-size text-body-sm flex items-center justify-center flex-shrink-0 border',
  variants: {
    active: {
      true: 'bg-danger/15 border-danger text-danger',
      false: 'bg-panel-2 border-border text-text hover:border-accent'
    }
  }
});
