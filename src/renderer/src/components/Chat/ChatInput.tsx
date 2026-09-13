import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { playMessageSentSound } from '@/services/soundEffects';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/constants/chat';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
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
    <div className="flex gap-2 mt-3">
      <TextInput
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleSend();
        }}
        maxLength={CHAT_MESSAGE_MAX_LENGTH}
        placeholder={CHAT_STRINGS.inputPlaceholder}
        className="flex-1 min-w-0"
        soundKind={TextInputSoundKind.CHAT}
      />
      <ActionButton type="button" variant="primary" className="flex-shrink-0" onClick={handleSend}>
        {CHAT_STRINGS.sendButton}
      </ActionButton>
    </div>
  );
}
