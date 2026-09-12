import { forwardRef } from 'react';
import { textInputVariants } from '@/components/TextInput/TextInput.variants';
import type { TextInputProps } from '@/components/TextInput/TextInput.types';

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({ className, ...inputProps }, ref) {
  return <input ref={ref} className={textInputVariants({ className })} {...inputProps} />;
});
