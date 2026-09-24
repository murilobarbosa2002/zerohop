import { useState } from 'react';
import clsx from 'clsx';
import { ChatMessageText } from '@/components/Chat/ChatMessageText';
import { playMessageReactSound } from '@/services/soundEffects';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import { CHAT_QUICK_REACTION_EMOJIS, SELF_SENDER_ID } from '@/constants/chat';
import type { ChatMessageContentProps } from '@/components/Chat/ChatMessageContent.types';

export function ChatMessageContent({ message, replyToMessage, onToggleReaction }: ChatMessageContentProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  function handleToggleReaction(emoji: string): void {
    onToggleReaction(emoji);
    playMessageReactSound();
    setShowReactionPicker(false);
  }

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div
        className={clsx(
          'rounded-lg px-3 py-2 text-body-sm min-w-0',
          message.self ? 'bg-accent-soft text-text' : 'bg-panel-2 border border-border text-text'
        )}
      >
        {message.replyToId && (
          <div className="border-l-2 border-border pl-2 mb-1.5 text-xs text-text-dim truncate">
            {replyToMessage ? (
              <>
                <span className="font-bold">{replyToMessage.self ? CHAT_STRINGS.selfSenderLabel : replyToMessage.fromName}:</span>{' '}
                {replyToMessage.text}
              </>
            ) : (
              CHAT_STRINGS.replyToUnknownMessage
            )}
          </div>
        )}
        <ChatMessageText text={message.text} />
        {message.edited && <span className="text-text-dim text-xs ml-1">{CHAT_STRINGS.editedTag}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {message.reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => handleToggleReaction(reaction.emoji)}
            className={clsx(
              'flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs',
              reaction.fromIds.includes(SELF_SENDER_ID) ? 'border-accent bg-accent-soft' : 'border-border bg-panel-2'
            )}
          >
            <span>{reaction.emoji}</span>
            <span className="text-text-dim">{reaction.fromIds.length}</span>
          </button>
        ))}
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker((current) => !current)}
            title={CHAT_STRINGS.reactButton}
            aria-label={CHAT_STRINGS.reactButton}
            className="text-text-dim hover:text-text text-xs px-1"
          >
            😀+
          </button>
          {showReactionPicker && (
            <div
              className={clsx(
                'absolute bottom-full z-10 mb-1 flex gap-1 rounded-lg border border-border bg-panel px-1.5 py-1',
                message.self ? 'right-0' : 'left-0'
              )}
            >
              {CHAT_QUICK_REACTION_EMOJIS.map((emoji) => (
                <button key={emoji} onClick={() => handleToggleReaction(emoji)} className="hover:scale-125 transition-transform">
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
