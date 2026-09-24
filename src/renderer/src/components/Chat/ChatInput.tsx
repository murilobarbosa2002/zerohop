import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { playMessageSentSound, playKeyClickSound } from '@/services/soundEffects';
import { isTypingKeystroke } from '@/lib/typingSound';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/constants/chat';
import type { ChatInputProps } from '@/components/Chat/Chat.types';

export function ChatInput({ onSend, replyTo, onCancelReply }: ChatInputProps) {
  const [text, setText] = useState('');

  function handleSend(): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed, replyTo?.id);
    setText('');
    playMessageSentSound();
  }

  return (
    <div className="mt-3">
      {replyTo && (
        <div className="flex items-center justify-between gap-2 bg-panel-2 border border-border rounded-t-lg px-3 py-1.5 text-xs">
          <p className="min-w-0 truncate text-text-dim">
            <span className="font-bold">{CHAT_STRINGS.replyPreviewLabel}</span>{' '}
            {replyTo.self ? CHAT_STRINGS.selfSenderLabel : replyTo.fromName}: {replyTo.text}
          </p>
          <button
            type="button"
            onClick={onCancelReply}
            title={CHAT_STRINGS.replyCancelButton}
            aria-label={CHAT_STRINGS.replyCancelButton}
            className="flex-shrink-0 text-danger hover:brightness-125"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex gap-2 items-end">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
              return;
            }
            if (isTypingKeystroke(event.key)) playKeyClickSound();
          }}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          placeholder={CHAT_STRINGS.inputPlaceholder}
          rows={2}
          className="flex-1 min-w-0 resize-none bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <ActionButton type="button" variant="primary" className="flex-shrink-0" onClick={handleSend}>
          {CHAT_STRINGS.sendButton}
        </ActionButton>
      </div>
    </div>
  );
}
