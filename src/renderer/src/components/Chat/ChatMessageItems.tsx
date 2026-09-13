import clsx from 'clsx';
import { ChatMessageText } from '@/components/Chat/ChatMessageText';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import type { ChatMessageListProps } from '@/components/Chat/Chat.types';

function formatSentAt(sentAt: number): string {
  return new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatMessageItems({ messages, onDelete, canDelete }: ChatMessageListProps) {
  return (
    <div className="flex flex-col gap-2.5 pr-1">
      {messages.map((message) => (
        <div key={message.id} className={clsx('flex flex-col max-w-chat-bubble', message.self ? 'self-end items-end' : 'self-start items-start')}>
          <span className="flex items-center gap-1.5 text-base text-text-dim font-bold mb-0.5">
            {message.self ? CHAT_STRINGS.selfSenderLabel : message.fromName} · {formatSentAt(message.sentAt)}
            {canDelete(message) && (
              <button
                onClick={() => onDelete(message.id)}
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
    </div>
  );
}
