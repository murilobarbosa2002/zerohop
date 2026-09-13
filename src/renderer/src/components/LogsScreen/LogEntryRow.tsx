import { useState } from 'react';
import { logLevelDotVariants } from '@/components/LogsScreen/LogsScreen.variants';
import { LOG_STRINGS } from '@/strings/logs.strings';
import type { LogEntryRowProps } from '@/components/LogsScreen/LogsScreen.types';

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' });
}

export function LogEntryRow({ entry }: LogEntryRowProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="bg-panel-2 border border-border rounded-lg px-3 py-2.5 flex gap-2.5">
      <span className={logLevelDotVariants({ level: entry.level })} />
      <div className="flex-1 min-w-0">
        <p className="text-body-sm-alt">{entry.message}</p>
        <p className="text-text-dim text-sm mt-1">{formatTimestamp(entry.timestamp)}</p>
        {entry.detail && (
          <>
            <button onClick={() => setShowDetail((current) => !current)} className="text-accent text-xs mt-1.5 hover:underline">
              {showDetail ? '▾' : '▸'} {LOG_STRINGS.technicalDetailsToggle}
            </button>
            {showDetail && (
              <pre className="text-text-dim text-xs mt-1.5 bg-bg border border-border rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap break-words">
                {entry.detail}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}
