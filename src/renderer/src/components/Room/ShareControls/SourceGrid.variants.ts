import { tv } from 'tailwind-variants';

export const sourceCardVariants = tv({
  base: 'border-2 rounded-source-card p-1.5 w-source-card-width text-center bg-panel-2 transition-colors',
  variants: {
    selected: {
      true: 'border-accent ring-2 ring-accent-soft',
      false: 'border-border hover:border-source-hover-border'
    }
  },
  defaultVariants: {
    selected: false
  }
});
