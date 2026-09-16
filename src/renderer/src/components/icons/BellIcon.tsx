import type { IconProps } from '@/components/icons/IconProps.types';

export function BellIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5V5.2a3 3 0 0 1 6 0v3.3l1 1.3H2l1-1.3Z" />
      <path d="M5 10.5a1 1 0 0 0 2 0" />
    </svg>
  );
}
