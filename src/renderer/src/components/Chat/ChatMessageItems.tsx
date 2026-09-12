import clsx from 'clsx';
import type { ChatMessageListProps } from '@/components/Chat/Chat.types';

export function ChatMessageItems({ messages }: ChatMessageListProps) {
  return (
    <div className="flex flex-col gap-2 pr-1">
      {messages.map((message) => (
        <div key={message.id} className={clsx('flex flex-col max-w-chat-bubble', message.self ? 'self-end items-end' : 'self-start items-start')}>
          {!message.self && <span className="text-badge-xs text-text-dim font-bold mb-0.5">{message.fromName}</span>}
          <span
            className={clsx(
              'rounded-lg px-3 py-2 text-body-sm',
              message.self ? 'bg-accent-soft text-text' : 'bg-panel-2 border border-border text-text'
            )}
          >
            {message.text}
          </span>
        </div>
      ))}
    </div>
  );
}
