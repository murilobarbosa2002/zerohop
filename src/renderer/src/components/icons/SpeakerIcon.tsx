import type { SpeakerIconProps } from '@/components/icons/SpeakerIcon.types';

export function SpeakerIcon({ muted }: SpeakerIconProps) {
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
      <path d="M1 4.5h1.8L6 2v8L2.8 7.5H1z" fill="currentColor" stroke="none" />
      {muted ? <path d="M8 4.5l3 3M11 4.5l-3 3" /> : <path d="M7.8 4a3 3 0 0 1 0 4" />}
    </svg>
  );
}
