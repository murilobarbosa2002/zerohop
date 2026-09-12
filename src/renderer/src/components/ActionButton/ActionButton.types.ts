import type { ButtonHTMLAttributes } from 'react';

export type ActionButtonVariant = 'default' | 'primary' | 'danger';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant;
}
