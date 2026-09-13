import { tv } from 'tailwind-variants';

export const actionButtonVariants = tv({
  base: 'px-3.5 py-2 mr-1 my-1 rounded-button text-body-sm font-semibold border transition-colors active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    variant: {
      default: 'bg-panel-2 border-border text-text hover:border-accent hover:bg-hover-panel',
      primary: 'bg-gradient-to-br from-accent to-accent-2 border-transparent text-white hover:brightness-110',
      danger: 'bg-panel-2 border-border text-text hover:border-hover-danger-border hover:bg-hover-danger-bg'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});
