import type { IconProps } from '@/components/icons/IconProps.types';

export function ProfileIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="6" cy="4" r="2.4" />
      <path d="M1.3 10.7C1.3 7.9 3.4 6.6 6 6.6S10.7 7.9 10.7 10.7" />
    </svg>
  );
}
