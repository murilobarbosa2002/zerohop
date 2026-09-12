import { cardVariants } from '@/components/Card/Card.variants';
import type { CardProps, CardTitleProps } from '@/components/Card/Card.types';

export function Card({ children, muted, className }: CardProps) {
  return <div className={cardVariants({ muted, className })}>{children}</div>;
}

export function CardTitle({ badge, children }: CardTitleProps) {
  return (
    <div className="flex items-center gap-2.5 text-sm font-bold mb-3 min-w-0">
      {badge !== undefined && (
        <span className="w-badge-size h-badge-size rounded-full bg-accent-soft text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
          {badge}
        </span>
      )}
      {children}
    </div>
  );
}
