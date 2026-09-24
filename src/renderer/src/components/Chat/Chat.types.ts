import type { ChatMessageEntry } from '@/services/room/ChatService';

export interface ChatProps {
  messages: ChatMessageEntry[];
  onSend: (text: string, replyToId?: string) => void;
  onDelete: (id: string) => void;
  canDelete: (message: ChatMessageEntry) => boolean;
  onEdit: (id: string, text: string) => void;
  canEdit: (message: ChatMessageEntry) => boolean;
  onToggleReaction: (id: string, emoji: string) => void;
}

export interface ChatMessageListProps {
  messages: ChatMessageEntry[];
  onDelete: (id: string) => void;
  canDelete: (message: ChatMessageEntry) => boolean;
  onEdit: (id: string, text: string) => void;
  canEdit: (message: ChatMessageEntry) => boolean;
  onToggleReaction: (id: string, emoji: string) => void;
  onReply: (message: ChatMessageEntry) => void;
}

export interface ChatInputProps {
  onSend: (text: string, replyToId?: string) => void;
  replyTo: ChatMessageEntry | null;
  onCancelReply: () => void;
}
