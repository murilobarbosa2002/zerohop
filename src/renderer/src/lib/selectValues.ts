import type { ChangeEvent } from 'react';

export function readSelectedValues(event: ChangeEvent<HTMLSelectElement>): string[] {
  return Array.from(event.target.selectedOptions).map((option) => option.value);
}
