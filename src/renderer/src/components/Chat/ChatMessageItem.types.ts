import type { ChatMessageEntry } from '@/services/room/ChatService';

export interface ChatMessageItemProps {
  message: ChatMessageEntry;
  replyToMessage: ChatMessageEntry | null;
  canDelete: boolean;
  canEdit: boolean;
  onRequestDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onToggleReaction: (id: string, emoji: string) => void;
  onReply: (message: ChatMessageEntry) => void;
}
