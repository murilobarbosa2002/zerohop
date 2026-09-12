import type { LogoProps } from '@/components/Logo/Logo.types';

export function Logo({ size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="13" rx="2" fill="#fff" fillOpacity="0.15" />
      <rect x="9" y="19" width="6" height="1.6" rx="0.8" fill="#fff" />
      <path d="M13 12a2.4 2.4 0 0 1 0-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 13.6a4.6 4.6 0 0 1 0-7.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <circle cx="10" cy="10" r="1.4" fill="#fff" />
    </svg>
  );
}
