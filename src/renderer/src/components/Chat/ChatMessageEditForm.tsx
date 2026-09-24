import { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { playMessageEditSaveSound } from '@/services/soundEffects';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/constants/chat';
import type { ChatMessageEditFormProps } from '@/components/Chat/ChatMessageEditForm.types';

export function ChatMessageEditForm({ initialText, onSave, onCancel }: ChatMessageEditFormProps) {
  const [text, setText] = useState(initialText);

  function handleSave(): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave(trimmed);
    playMessageEditSaveSound();
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <textarea
        autoFocus
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSave();
          }
          if (event.key === 'Escape') onCancel();
        }}
        maxLength={CHAT_MESSAGE_MAX_LENGTH}
        placeholder={CHAT_STRINGS.editInputPlaceholder}
        rows={2}
        className="w-full resize-none bg-input-bg text-text border border-border rounded-lg px-3 py-2 text-body-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
      <div className="flex gap-2 self-end">
        <ActionButton type="button" variant="default" onClick={onCancel}>
          {CHAT_STRINGS.editCancelButton}
        </ActionButton>
        <ActionButton type="button" variant="primary" onClick={handleSave}>
          {CHAT_STRINGS.editSaveButton}
        </ActionButton>
      </div>
    </div>
  );
}
