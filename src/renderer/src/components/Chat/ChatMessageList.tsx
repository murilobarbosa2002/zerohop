import { ChatEmptyState } from '@/components/Chat/ChatEmptyState';
import { ChatMessageItems } from '@/components/Chat/ChatMessageItems';
import type { ChatMessageListProps } from '@/components/Chat/Chat.types';

export function ChatMessageList({ messages }: ChatMessageListProps) {
  return messages.length === 0 ? <ChatEmptyState /> : <ChatMessageItems messages={messages} />;
}
