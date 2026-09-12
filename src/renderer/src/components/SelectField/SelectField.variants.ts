import { tv } from 'tailwind-variants';

export const selectFieldVariants = tv({
  base: 'flex flex-col gap-1.5 text-xs text-text-dim font-semibold min-w-0',
  variants: {
    wide: {
      true: 'max-w-form-column-wide',
      false: 'max-w-form-column'
    }
  },
  defaultVariants: {
    wide: false
  }
});
