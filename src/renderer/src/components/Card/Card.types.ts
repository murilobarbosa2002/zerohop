import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  muted?: boolean;
  className?: string;
}

export interface CardTitleProps {
  badge?: number;
  children: ReactNode;
}
