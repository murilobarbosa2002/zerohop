import type { LogoProps } from '@/components/Logo/Logo.types';

export function Logo({ size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <g transform="translate(12 11.5)">
        <g id="logo-petal">
          <path d="M0 -1.7 C 3.4 -1.7, 5.2 -6.2, 2.4 -9 C 0.5 -10.8, -0.5 -10.8, -2.4 -9 C -5.2 -6.2, -3.4 -1.7, 0 -1.7 Z" fill="#fff" />
        </g>
        <use href="#logo-petal" transform="rotate(72)" />
        <use href="#logo-petal" transform="rotate(144)" />
        <use href="#logo-petal" transform="rotate(216)" />
        <use href="#logo-petal" transform="rotate(288)" />
        <circle r="2.6" fill="#fff" fillOpacity="0.55" />
      </g>
    </svg>
  );
}
