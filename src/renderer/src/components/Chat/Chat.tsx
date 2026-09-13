import { ChatMessageList } from '@/components/Chat/ChatMessageList';
import { ChatInput } from '@/components/Chat/ChatInput';
import type { ChatProps } from '@/components/Chat/Chat.types';

export function Chat({ messages, onSend, onDelete, canDelete }: ChatProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <ChatMessageList messages={messages} onDelete={onDelete} canDelete={canDelete} />
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
}
