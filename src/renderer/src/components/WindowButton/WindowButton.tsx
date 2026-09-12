import { windowButtonVariants } from '@/components/WindowButton/WindowButton.variants';
import type { WindowButtonProps } from '@/components/WindowButton/WindowButton.types';

export function WindowButton({ onClick, label, danger, children }: WindowButtonProps) {
  return (
    <button onClick={onClick} title={label} aria-label={label} className={windowButtonVariants({ danger })}>
      {children}
    </button>
  );
}
