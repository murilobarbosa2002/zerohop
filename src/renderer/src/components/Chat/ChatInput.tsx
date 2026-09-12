import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
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
  }

  return (
    <div className="flex gap-2 mt-3">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleSend();
        }}
        maxLength={CHAT_MESSAGE_MAX_LENGTH}
        placeholder={CHAT_STRINGS.inputPlaceholder}
        className="flex-1 bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder"
      />
      <ActionButton type="button" variant="primary" onClick={handleSend}>
        {CHAT_STRINGS.sendButton}
      </ActionButton>
    </div>
  );
}
