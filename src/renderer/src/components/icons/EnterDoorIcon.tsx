import type { IconProps } from '@/components/icons/IconProps.types';

export function EnterDoorIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M6.8 1H2.5A0.7 0.7 0 0 0 1.8 1.7V10.3A0.7 0.7 0 0 0 2.5 11H6.8" />
      <path d="M4.8 6H11M8.6 3.8L11 6L8.6 8.2" />
    </svg>
  );
}
