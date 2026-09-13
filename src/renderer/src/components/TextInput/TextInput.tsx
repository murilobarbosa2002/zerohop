import { forwardRef } from 'react';
import { textInputVariants } from '@/components/TextInput/TextInput.variants';
import { TEXT_INPUT_SOUNDS } from '@/services/soundEffects';
import type { TextInputProps } from '@/components/TextInput/TextInput.types';

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, soundKind, onFocus, onKeyDown, ...inputProps },
  ref
) {
  const sounds = soundKind ? TEXT_INPUT_SOUNDS[soundKind] : undefined;

  return (
    <input
      ref={ref}
      className={textInputVariants({ className })}
      onFocus={(event) => {
        sounds?.focus();
        onFocus?.(event);
      }}
      onKeyDown={(event) => {
        if (sounds && (event.key.length === 1 || event.key === 'Backspace')) sounds.type();
        onKeyDown?.(event);
      }}
      {...inputProps}
    />
  );
});
