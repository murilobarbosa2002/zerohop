import type { ChatMessageEntry } from '@/services/room/ChatService';

export interface ChatMessageContentProps {
  message: ChatMessageEntry;
  replyToMessage: ChatMessageEntry | null;
  onToggleReaction: (emoji: string) => void;
}
