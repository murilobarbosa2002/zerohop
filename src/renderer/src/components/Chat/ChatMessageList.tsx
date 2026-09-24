import { ChatEmptyState } from '@/components/Chat/ChatEmptyState';
import { ChatMessageItems } from '@/components/Chat/ChatMessageItems';
import type { ChatMessageListProps } from '@/components/Chat/Chat.types';

export function ChatMessageList({ messages, onDelete, canDelete, onEdit, canEdit, onToggleReaction, onReply }: ChatMessageListProps) {
  return messages.length === 0 ? (
    <ChatEmptyState />
  ) : (
    <ChatMessageItems
      messages={messages}
      onDelete={onDelete}
      canDelete={canDelete}
      onEdit={onEdit}
      canEdit={canEdit}
      onToggleReaction={onToggleReaction}
      onReply={onReply}
    />
  );
}
