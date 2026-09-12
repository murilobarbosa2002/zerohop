import { useCallback, useEffect, useState } from 'react';
import type { LogEntry } from '@shared/logEntry';
import type { AppLogsState } from '@/hooks/useAppLogs.types';

export function useAppLogs(): AppLogsState {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    window.api.getLogs().then(setEntries);
  }, []);

  useEffect(() => window.api.onLogAdded((entry) => setEntries((current) => [...current, entry])), []);

  const clear = useCallback(() => {
    window.api.clearLogs();
    setEntries([]);
  }, []);

  return { entries, clear };
}
