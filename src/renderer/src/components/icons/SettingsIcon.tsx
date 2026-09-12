import type { IconProps } from '@/components/icons/IconProps.types';

export function SettingsIcon({ className = 'w-3.5 h-3.5' }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="6" cy="6" r="1.8" />
      <path d="M6 0.8v1.4M6 9.8v1.4M11.2 6H9.8M2.2 6H0.8M9.5 2.5l-1 1M3.5 8.5l-1 1M9.5 9.5l-1-1M3.5 3.5l-1-1" />
    </svg>
  );
}
