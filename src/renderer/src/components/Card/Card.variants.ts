import { tv } from 'tailwind-variants';

export const cardVariants = tv({
  base: 'bg-panel border border-border rounded-card px-5 py-card-padding-y mb-4',
  variants: {
    muted: {
      true: 'bg-panel-2'
    }
  }
});
