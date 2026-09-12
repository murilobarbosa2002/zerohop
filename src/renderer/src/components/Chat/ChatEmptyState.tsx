import { CHAT_STRINGS } from '@/strings/chat.strings';

export function ChatEmptyState() {
  return <p className="text-text-dim text-xs py-2.5">{CHAT_STRINGS.emptyMessage}</p>;
}
