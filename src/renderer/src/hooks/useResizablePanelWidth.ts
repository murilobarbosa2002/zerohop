import { useCallback, useState } from 'react';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useResizablePanelWidth(
  storageKey: string,
  defaultWidth: number,
  min: number,
  max: number
): [number, (updater: number | ((current: number) => number)) => void] {
  const [width, setWidthState] = useState(() => {
    try {
      const stored = Number(localStorage.getItem(storageKey));
      return Number.isFinite(stored) && stored > 0 ? clamp(stored, min, max) : defaultWidth;
    } catch {
      return defaultWidth;
    }
  });

  const setWidth = useCallback(
    (updater: number | ((current: number) => number)) => {
      setWidthState((current) => {
        const next = clamp(typeof updater === 'function' ? updater(current) : updater, min, max);
        try {
          localStorage.setItem(storageKey, String(next));
        } catch {
          // localStorage indisponível (ex: modo privado) — só não persiste entre sessões
        }
        return next;
      });
    },
    [storageKey, min, max]
  );

  return [width, setWidth];
}
