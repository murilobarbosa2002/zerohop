import { useState } from 'react';
import clsx from 'clsx';
import { ChatMessageContent } from '@/components/Chat/ChatMessageContent';
import { ChatMessageEditForm } from '@/components/Chat/ChatMessageEditForm';
import { playMessageReplySound } from '@/services/soundEffects';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import type { ChatMessageItemProps } from '@/components/Chat/ChatMessageItem.types';

function formatSentAt(sentAt: number): string {
  return new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatMessageItem({
  message,
  replyToMessage,
  canDelete,
  canEdit,
  onRequestDelete,
  onEdit,
  onToggleReaction,
  onReply
}: ChatMessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  function handleReply(): void {
    onReply(message);
    playMessageReplySound();
  }

  return (
    <div className={clsx('flex flex-col max-w-chat-bubble', message.self ? 'self-end items-end' : 'self-start items-start')}>
      <span className="flex items-center gap-1.5 text-base text-text-dim font-bold mb-0.5">
        {message.self ? CHAT_STRINGS.selfSenderLabel : message.fromName} · {formatSentAt(message.sentAt)}
        <button onClick={handleReply} title={CHAT_STRINGS.replyButton} aria-label={CHAT_STRINGS.replyButton} className="hover:text-text">
          ↩
        </button>
        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            title={CHAT_STRINGS.editMessageButton}
            aria-label={CHAT_STRINGS.editMessageButton}
            className="hover:text-text"
          >
            ✎
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onRequestDelete(message.id)}
            title={CHAT_STRINGS.deleteMessageButton}
            aria-label={CHAT_STRINGS.deleteMessageButton}
            className="text-danger hover:brightness-125"
          >
            ×
          </button>
        )}
      </span>

      {isEditing ? (
        <ChatMessageEditForm
          initialText={message.text}
          onCancel={() => setIsEditing(false)}
          onSave={(text) => {
            onEdit(message.id, text);
            setIsEditing(false);
          }}
        />
      ) : (
        <ChatMessageContent
          message={message}
          replyToMessage={replyToMessage}
          onToggleReaction={(emoji) => onToggleReaction(message.id, emoji)}
        />
      )}
    </div>
  );
}
