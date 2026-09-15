import type { IconProps } from '@/components/icons/IconProps.types';

export function PlusCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="6" cy="6" r="5.2" />
      <path d="M6 3.2v5.6M3.2 6h5.6" />
    </svg>
  );
}
