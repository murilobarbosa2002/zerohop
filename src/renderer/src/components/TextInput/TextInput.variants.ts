import { tv } from 'tailwind-variants';

export const textInputVariants = tv({
  base: 'bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30'
});
