import type { ReactNode } from 'react';

export interface PreRoomChoiceOptionProps {
  icon: ReactNode;
  title: string;
  hint: string;
  primary?: boolean;
  onClick: () => void;
}
