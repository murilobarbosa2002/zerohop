import type { MicIconProps } from '@/components/icons/MicIcon.types';

export function MicIcon({ muted }: MicIconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="4" y="1" width="4" height="6" rx="2" />
      <path d="M2.5 6.5a3.5 3.5 0 0 0 7 0" />
      <line x1="6" y1="9.5" x2="6" y2="11" />
      <line x1="4" y1="11" x2="8" y2="11" />
      {muted && <line x1="1.5" y1="10.5" x2="10.5" y2="1.5" />}
    </svg>
  );
}
