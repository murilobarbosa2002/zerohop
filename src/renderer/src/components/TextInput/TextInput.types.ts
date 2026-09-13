import type { InputHTMLAttributes } from 'react';
import type { TextInputSoundKind } from '@/constants/textInputSoundKind';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  soundKind?: TextInputSoundKind;
}
