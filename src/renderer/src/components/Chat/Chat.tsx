import { ChatMessageList } from '@/components/Chat/ChatMessageList';
import { ChatInput } from '@/components/Chat/ChatInput';
import type { ChatProps } from '@/components/Chat/Chat.types';

export function Chat({ messages, onSend }: ChatProps) {
  return (
    <div>
      <ChatMessageList messages={messages} />
      <ChatInput onSend={onSend} />
    </div>
  );
}
