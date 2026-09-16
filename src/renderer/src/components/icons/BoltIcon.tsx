import type { IconProps } from '@/components/icons/IconProps.types';

export function BoltIcon({ className = 'w-2.5 h-2.5' }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.6 0.8L2.2 6.6H5.4L4.6 11.2L9.4 5H6.2L6.6 0.8Z" />
    </svg>
  );
}
