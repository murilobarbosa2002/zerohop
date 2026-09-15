import type { IconProps } from '@/components/icons/IconProps.types';

export function PeopleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="4.3" cy="3.8" r="1.8" />
      <path d="M1 10.2C1 7.9 2.5 6.6 4.3 6.6S7.6 7.9 7.6 10.2" />
      <circle cx="8.6" cy="4.2" r="1.4" />
      <path d="M8 6.7C9.6 6.7 11 7.7 11 9.7" />
    </svg>
  );
}
