import { tv } from 'tailwind-variants';

export const headingVariants = tv({
  base: 'font-bold text-text',
  variants: {
    level: {
      1: 'text-lg',
      2: 'text-base',
      3: 'text-body-sm-alt'
    }
  }
});
