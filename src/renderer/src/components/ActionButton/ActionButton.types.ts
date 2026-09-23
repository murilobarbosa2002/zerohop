import type { ButtonHTMLAttributes } from 'react';

export type ActionButtonVariant = 'default' | 'primary' | 'danger';
export type ActionButtonSize = 'default' | 'compact';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
}
