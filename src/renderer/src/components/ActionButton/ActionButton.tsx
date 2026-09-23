import { actionButtonVariants } from '@/components/ActionButton/ActionButton.variants';
import type { ActionButtonProps } from '@/components/ActionButton/ActionButton.types';

export function ActionButton({ variant, size, className, ...buttonProps }: ActionButtonProps) {
  return <button className={actionButtonVariants({ variant, size, className })} {...buttonProps} />;
}
