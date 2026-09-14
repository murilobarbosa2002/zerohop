import type { EyeIconProps } from '@/components/icons/EyeIcon.types';

export function EyeIcon({ crossed }: EyeIconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 6c1.2-2.2 3-3.3 5-3.3S9.8 3.8 11 6c-1.2 2.2-3 3.3-5 3.3S2.2 8.2 1 6z" />
      <circle cx="6" cy="6" r="1.5" />
      {crossed && <line x1="1" y1="11" x2="11" y2="1" />}
    </svg>
  );
}
