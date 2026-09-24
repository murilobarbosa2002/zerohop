import { useMemo, useState } from 'react';
import { ChatMessageItem } from '@/components/Chat/ChatMessageItem';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { playMessageDeleteSound, playMessageDeleteCancelSound } from '@/services/soundEffects';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import type { ChatMessageListProps } from '@/components/Chat/Chat.types';

export function ChatMessageItems({ messages, onDelete, canDelete, onEdit, canEdit, onToggleReaction, onReply }: ChatMessageListProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const messagesById = useMemo(() => new Map(messages.map((message) => [message.id, message])), [messages]);

  function confirmDelete(): void {
    if (!pendingDeleteId) return;
    onDelete(pendingDeleteId);
    playMessageDeleteSound();
    setPendingDeleteId(null);
  }

  function cancelDelete(): void {
    setPendingDeleteId(null);
    playMessageDeleteCancelSound();
  }

  return (
    <div className="flex flex-col gap-2.5 pr-1 min-w-0">
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          replyToMessage={message.replyToId ? (messagesById.get(message.replyToId) ?? null) : null}
          canDelete={canDelete(message)}
          canEdit={canEdit(message)}
          onRequestDelete={setPendingDeleteId}
          onEdit={onEdit}
          onToggleReaction={onToggleReaction}
          onReply={onReply}
        />
      ))}

      {pendingDeleteId && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-bg/80 px-4">
          <div className="w-full max-w-modal">
            <Card>
              <p className="font-bold text-body-sm-alt">{CHAT_STRINGS.deleteConfirmTitle}</p>
              <p className="text-text-dim text-xs mt-1.5">{CHAT_STRINGS.deleteConfirmBody}</p>
              <div className="flex gap-2 mt-3.5">
                <ActionButton variant="default" className="flex-1" onClick={cancelDelete}>
                  {CHAT_STRINGS.deleteConfirmCancelButton}
                </ActionButton>
                <ActionButton variant="danger" className="flex-1" onClick={confirmDelete}>
                  {CHAT_STRINGS.deleteConfirmDeleteButton}
                </ActionButton>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
