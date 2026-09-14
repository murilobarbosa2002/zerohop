import { useState } from 'react';
import clsx from 'clsx';
import { ChatMessageText } from '@/components/Chat/ChatMessageText';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { playMessageDeleteSound } from '@/services/soundEffects';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import type { ChatMessageListProps } from '@/components/Chat/Chat.types';

function formatSentAt(sentAt: number): string {
  return new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatMessageItems({ messages, onDelete, canDelete }: ChatMessageListProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function confirmDelete(): void {
    if (!pendingDeleteId) return;
    onDelete(pendingDeleteId);
    playMessageDeleteSound();
    setPendingDeleteId(null);
  }

  return (
    <div className="flex flex-col gap-2.5 pr-1">
      {messages.map((message) => (
        <div
          key={message.id}
          className={clsx('flex flex-col max-w-chat-bubble', message.self ? 'self-end items-end' : 'self-start items-start')}
        >
          <span className="flex items-center gap-1.5 text-base text-text-dim font-bold mb-0.5">
            {message.self ? CHAT_STRINGS.selfSenderLabel : message.fromName} · {formatSentAt(message.sentAt)}
            {canDelete(message) && (
              <button
                onClick={() => setPendingDeleteId(message.id)}
                title={CHAT_STRINGS.deleteMessageButton}
                aria-label={CHAT_STRINGS.deleteMessageButton}
                className="text-danger hover:brightness-125"
              >
                ×
              </button>
            )}
          </span>
          <span
            className={clsx(
              'rounded-lg px-3 py-2 text-body-sm',
              message.self ? 'bg-accent-soft text-text' : 'bg-panel-2 border border-border text-text'
            )}
          >
            <ChatMessageText text={message.text} />
          </span>
        </div>
      ))}

      {pendingDeleteId && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-bg/80 px-4">
          <div className="w-full max-w-modal">
            <Card>
              <p className="font-bold text-body-sm-alt">{CHAT_STRINGS.deleteConfirmTitle}</p>
              <p className="text-text-dim text-xs mt-1.5">{CHAT_STRINGS.deleteConfirmBody}</p>
              <div className="flex gap-2 mt-3.5">
                <ActionButton variant="default" className="flex-1" onClick={() => setPendingDeleteId(null)}>
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
