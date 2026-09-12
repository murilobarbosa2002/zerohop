import { tv } from 'tailwind-variants';

export const statusDotVariants = tv({
  base: 'w-status-dot-size h-status-dot-size rounded-full',
  variants: {
    connected: {
      true: 'bg-success shadow-glow-success',
      false: 'bg-status-dot-idle'
    }
  },
  defaultVariants: {
    connected: false
  }
});
