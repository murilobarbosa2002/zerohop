import { useState } from 'react';
import { ChatMessageList } from '@/components/Chat/ChatMessageList';
import { ChatInput } from '@/components/Chat/ChatInput';
import type { ChatMessageEntry } from '@/services/room/ChatService';
import type { ChatProps } from '@/components/Chat/Chat.types';

export function Chat({ messages, onSend, onDelete, canDelete, onEdit, canEdit, onToggleReaction }: ChatProps) {
  const [replyTo, setReplyTo] = useState<ChatMessageEntry | null>(null);

  function handleSend(text: string, replyToId?: string): void {
    onSend(text, replyToId);
    setReplyTo(null);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        <ChatMessageList
          messages={messages}
          onDelete={onDelete}
          canDelete={canDelete}
          onEdit={onEdit}
          canEdit={canEdit}
          onToggleReaction={onToggleReaction}
          onReply={setReplyTo}
        />
      </div>
      <ChatInput onSend={handleSend} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
    </div>
  );
}
