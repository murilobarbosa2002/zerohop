import type { ChatMessageEntry } from '@/services/room/ChatService';

export interface ChatProps {
  messages: ChatMessageEntry[];
  onSend: (text: string) => void;
}

export interface ChatMessageListProps {
  messages: ChatMessageEntry[];
}

export interface ChatInputProps {
  onSend: (text: string) => void;
}
