import type { ReactNode } from 'react';

export interface WindowButtonProps {
  onClick: () => void;
  label: string;
  danger?: boolean;
  children: ReactNode;
}
