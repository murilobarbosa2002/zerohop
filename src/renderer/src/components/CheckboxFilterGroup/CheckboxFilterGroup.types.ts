import type { ReactNode } from 'react';

export interface CheckboxFilterOption {
  value: string;
  label: string;
}

export interface CheckboxFilterGroupProps {
  label: ReactNode;
  options: CheckboxFilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}
