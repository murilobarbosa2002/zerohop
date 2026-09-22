import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { CLOCK_TICK_INTERVAL_MS } from '@/constants/timing';
import { HOME_STRINGS } from '@/strings/home.strings';

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function RetroClockTipPanel() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), CLOCK_TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const tip = HOME_STRINGS.tips[dayOfYear(now) % HOME_STRINGS.tips.length];

  return (
    <Card muted>
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-body-sm-alt">{HOME_STRINGS.clockTipTitle}</p>
        <span className="font-mono font-bold text-accent text-body-sm flex-shrink-0">
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{tip}</p>
    </Card>
  );
}
