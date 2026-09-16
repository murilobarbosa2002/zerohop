import { notificationDotVariants } from '@/components/NotificationsScreen/NotificationsScreen.variants';
import type { NotificationEntryRowProps } from '@/components/NotificationsScreen/NotificationsScreen.types';

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' });
}

export function NotificationEntryRow({ entry, onRead }: NotificationEntryRowProps) {
  return (
    <button
      onClick={() => onRead(entry.id)}
      className={`w-full text-left bg-panel-2 border border-border rounded-lg px-3 py-2.5 flex gap-2.5 ${
        entry.read ? '' : 'border-accent'
      }`}
    >
      <span className={notificationDotVariants({ kind: entry.kind })} />
      <div className="flex-1 min-w-0">
        <p className="text-body-sm-alt">{entry.message}</p>
        <p className="text-text-dim text-sm mt-1">{formatTimestamp(entry.timestamp)}</p>
      </div>
    </button>
  );
}
