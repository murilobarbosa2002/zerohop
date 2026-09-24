import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { playMessageSentSound, playKeyClickSound } from '@/services/soundEffects';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/constants/chat';
import type { ChatInputProps } from '@/components/Chat/Chat.types';

export function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');

  function handleSend(): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    playMessageSentSound();
  }

  return (
    <div className="flex gap-2 mt-3 items-end">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
            return;
          }
          if (event.key.length === 1 || event.key === 'Backspace') playKeyClickSound();
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
  );
}
