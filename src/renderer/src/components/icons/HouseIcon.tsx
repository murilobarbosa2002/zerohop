import type { IconProps } from '@/components/icons/IconProps.types';

export function HouseIcon({ className = 'w-2.5 h-2.5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 6L6 1.8L10.5 6" />
      <path d="M2.8 5V10H9.2V5" />
    </svg>
  );
}
