import { useCallback, useEffect, useState } from 'react';
import type { CaptureSource } from '@shared/ipc-types';
import { SOURCE_PICKER_AUTO_REFRESH_INTERVAL_MS } from '@/constants/timing';
import type { SourcePickerState } from '@/hooks/useSourcePicker.types';

export function useSourcePicker(): SourcePickerState {
  const [sources, setSources] = useState<CaptureSource[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [watching, setWatching] = useState(false);

  const refresh = useCallback(async (): Promise<CaptureSource[]> => {
    setLoading(true);
    try {
      const result = await window.api.getSources();
      setSources(result);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!watching) return;
    const interval = setInterval(refresh, SOURCE_PICKER_AUTO_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [watching, refresh]);

  return { sources, selectedId, loading, select: setSelectedId, refresh, setWatching };
}
