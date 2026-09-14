import { forwardRef, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { EyeIcon } from '@/components/icons';
import { COMMON_STRINGS } from '@/strings/common.strings';
import type { PasswordInputProps } from '@/components/PasswordInput/PasswordInput.types';

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ className, ...inputProps }, ref) {
  const [visible, setVisible] = useState(true);
  const label = visible ? COMMON_STRINGS.hidePasswordButton : COMMON_STRINGS.showPasswordButton;

  return (
    <div className="relative w-full">
      <TextInput ref={ref} type={visible ? 'text' : 'password'} className={`w-full pr-9 ${className ?? ''}`} {...inputProps} />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        title={label}
        aria-label={label}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text"
      >
        <EyeIcon crossed={!visible} />
      </button>
    </div>
  );
});
