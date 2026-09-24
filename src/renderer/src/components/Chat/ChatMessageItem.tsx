import { useState } from 'react';
import clsx from 'clsx';
import { ChatMessageContent } from '@/components/Chat/ChatMessageContent';
import { ChatMessageEditForm } from '@/components/Chat/ChatMessageEditForm';
import { ReplyIcon, EditPencilIcon, CloseIcon } from '@/components/icons';
import { playMessageReplySound, playMessageEditOpenSound, playMessageDeleteOpenSound } from '@/services/soundEffects';
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

  function handleRequestDelete(): void {
    onRequestDelete(message.id);
    playMessageDeleteOpenSound();
  }

  return (
    <div className={clsx('flex flex-col max-w-chat-bubble min-w-0', message.self ? 'self-end items-end' : 'self-start items-start')}>
      <span className="flex items-center gap-2 text-base text-text-dim font-bold mb-0.5">
        {message.self ? CHAT_STRINGS.selfSenderLabel : message.fromName} · {formatSentAt(message.sentAt)}
        <button onClick={handleReply} title={CHAT_STRINGS.replyButton} aria-label={CHAT_STRINGS.replyButton} className="hover:text-text">
          <ReplyIcon />
        </button>
        {canEdit && !isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              playMessageEditOpenSound();
            }}
            title={CHAT_STRINGS.editMessageButton}
            aria-label={CHAT_STRINGS.editMessageButton}
            className="hover:text-text"
          >
            <EditPencilIcon />
          </button>
        )}
        {canDelete && (
          <button
            onClick={handleRequestDelete}
            title={CHAT_STRINGS.deleteMessageButton}
            aria-label={CHAT_STRINGS.deleteMessageButton}
            className="text-danger hover:brightness-125"
          >
            <CloseIcon className="w-3.5 h-3.5" />
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
