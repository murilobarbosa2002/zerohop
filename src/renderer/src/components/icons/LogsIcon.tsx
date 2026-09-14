import type { IconProps } from '@/components/icons/IconProps.types';

export function LogsIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="2" y1="3" x2="10" y2="3" />
      <line x1="2" y1="6" x2="10" y2="6" />
      <line x1="2" y1="9" x2="7" y2="9" />
    </svg>
  );
}
