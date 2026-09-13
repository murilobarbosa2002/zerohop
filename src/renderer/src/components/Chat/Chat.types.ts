import type { ChatMessageEntry } from '@/services/room/ChatService';

export interface ChatProps {
  messages: ChatMessageEntry[];
  onSend: (text: string) => void;
  onDelete: (id: string) => void;
  canDelete: (message: ChatMessageEntry) => boolean;
}

export interface ChatMessageListProps {
  messages: ChatMessageEntry[];
  onDelete: (id: string) => void;
  canDelete: (message: ChatMessageEntry) => boolean;
}

export interface ChatInputProps {
  onSend: (text: string) => void;
}
