import {
  playFormatBoldSound,
  playFormatItalicSound,
  playFormatStrikethroughSound,
  playFormatCodeInlineSound,
  playFormatCodeBlockSound
} from '@/services/soundEffects';
import { CHAT_STRINGS } from '@/strings/chat.strings';
import type { ChatFormatToolbarProps } from '@/components/Chat/ChatFormatToolbar.types';

const BUTTON_CLASSNAME =
  'w-6 h-6 flex items-center justify-center bg-panel-2 border border-border rounded-lg text-body-xs hover:border-accent hover:bg-hover-panel';

export function ChatFormatToolbar({ onWrapSelection }: ChatFormatToolbarProps) {
  return (
    <div className="flex gap-1 mb-1.5">
      <button
        type="button"
        title={CHAT_STRINGS.formatBoldButton}
        aria-label={CHAT_STRINGS.formatBoldButton}
        className={`${BUTTON_CLASSNAME} font-bold`}
        onClick={() => {
          onWrapSelection('**', '**', 'negrito');
          playFormatBoldSound();
        }}
      >
        B
      </button>
      <button
        type="button"
        title={CHAT_STRINGS.formatItalicButton}
        aria-label={CHAT_STRINGS.formatItalicButton}
        className={`${BUTTON_CLASSNAME} italic`}
        onClick={() => {
          onWrapSelection('*', '*', 'itálico');
          playFormatItalicSound();
        }}
      >
        I
      </button>
      <button
        type="button"
        title={CHAT_STRINGS.formatStrikethroughButton}
        aria-label={CHAT_STRINGS.formatStrikethroughButton}
        className={`${BUTTON_CLASSNAME} line-through`}
        onClick={() => {
          onWrapSelection('~~', '~~', 'riscado');
          playFormatStrikethroughSound();
        }}
      >
        S
      </button>
      <button
        type="button"
        title={CHAT_STRINGS.formatCodeInlineButton}
        aria-label={CHAT_STRINGS.formatCodeInlineButton}
        className={`${BUTTON_CLASSNAME} font-mono`}
        onClick={() => {
          onWrapSelection('`', '`', 'código');
          playFormatCodeInlineSound();
        }}
      >
        {'</>'}
      </button>
      <button
        type="button"
        title={CHAT_STRINGS.formatCodeBlockButton}
        aria-label={CHAT_STRINGS.formatCodeBlockButton}
        className={`${BUTTON_CLASSNAME} font-mono`}
        onClick={() => {
          onWrapSelection('```\n', '\n```', 'código');
          playFormatCodeBlockSound();
        }}
      >
        {'{ }'}
      </button>
    </div>
  );
}
