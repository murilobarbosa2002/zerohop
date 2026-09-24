import { sendTo } from '@/services/room/peerSession';
import { SELF_SENDER_ID } from '@/constants/chat';
import type { MemberRegistry } from '@/services/room/MemberRegistry';

export interface ChatMessageReaction {
  emoji: string;
  fromIds: string[];
}

export interface ChatMessageEntry {
  id: string;
  fromId: string;
  fromName: string;
  text: string;
  self: boolean;
  sentAt: number;
  replyToId?: string;
  edited: boolean;
  reactions: ChatMessageReaction[];
}

export interface ChatServiceEventDetail {
  'message-added': { messages: ChatMessageEntry[] };
  'message-received': { message: ChatMessageEntry };
  'message-deleted-remote': { id: string };
}

interface ChatServiceDeps {
  registry: MemberRegistry;
  getSelfName: () => string;
  getRoomCode: () => string | null;
  isRoomCreator: () => boolean;
}

export class ChatService extends EventTarget {
  private registry: MemberRegistry;
  private getSelfName: () => string;
  private getRoomCode: () => string | null;
  private isRoomCreator: () => boolean;
  private messages: ChatMessageEntry[] = [];

  constructor({ registry, getSelfName, getRoomCode, isRoomCreator }: ChatServiceDeps) {
    super();
    this.registry = registry;
    this.getSelfName = getSelfName;
    this.getRoomCode = getRoomCode;
    this.isRoomCreator = isRoomCreator;
  }

  send(text: string, replyToId?: string): void {
    const id = crypto.randomUUID();
    const entry: ChatMessageEntry = {
      id,
      fromId: SELF_SENDER_ID,
      fromName: this.getSelfName(),
      text,
      self: true,
      sentAt: Date.now(),
      edited: false,
      reactions: [],
      ...(replyToId ? { replyToId } : {})
    };
    this.messages = [...this.messages, entry];
    for (const member of this.registry.values()) {
      if (member.authenticated) sendTo(member.conn, { type: 'chat', id, text, ...(replyToId ? { replyToId } : {}) });
    }
    this.emitMessages();
  }

  receive(fromId: string, id: string, text: string, replyToId?: string): void {
    const member = this.registry.get(fromId);
    const entry: ChatMessageEntry = {
      id,
      fromId,
      fromName: member?.name || fromId,
      text,
      self: false,
      sentAt: Date.now(),
      edited: false,
      reactions: [],
      ...(replyToId ? { replyToId } : {})
    };
    this.messages = [...this.messages, entry];
    this.emitMessages();
    this.dispatchEvent(new CustomEvent('message-received', { detail: { message: entry } }));
  }

  canEdit(message: ChatMessageEntry): boolean {
    return message.self;
  }

  editMessage(id: string, text: string): void {
    const message = this.messages.find((entry) => entry.id === id);
    if (!message || !message.self) return;
    this.messages = this.messages.map((entry) => (entry.id === id ? { ...entry, text, edited: true } : entry));
    for (const member of this.registry.values()) {
      if (member.authenticated) sendTo(member.conn, { type: 'edit-message', id, text });
    }
    this.emitMessages();
  }

  receiveEdit(fromId: string, id: string, text: string): void {
    const message = this.messages.find((entry) => entry.id === id);
    if (!message || message.fromId !== fromId) return;
    this.messages = this.messages.map((entry) => (entry.id === id ? { ...entry, text, edited: true } : entry));
    this.emitMessages();
  }

  toggleReaction(messageId: string, emoji: string): void {
    if (!this.applyReactionToggle(messageId, emoji, SELF_SENDER_ID)) return;
    for (const member of this.registry.values()) {
      if (member.authenticated) sendTo(member.conn, { type: 'react-message', messageId, emoji });
    }
    this.emitMessages();
  }

  receiveReaction(fromId: string, messageId: string, emoji: string): void {
    if (!this.applyReactionToggle(messageId, emoji, fromId)) return;
    this.emitMessages();
  }

  private applyReactionToggle(messageId: string, emoji: string, reactorId: string): boolean {
    const message = this.messages.find((entry) => entry.id === messageId);
    if (!message) return false;
    const existingReaction = message.reactions.find((reaction) => reaction.emoji === emoji);
    const hasReacted = existingReaction?.fromIds.includes(reactorId) ?? false;
    const nextReactions = hasReacted
      ? message.reactions
          .map((reaction) =>
            reaction.emoji === emoji ? { ...reaction, fromIds: reaction.fromIds.filter((id) => id !== reactorId) } : reaction
          )
          .filter((reaction) => reaction.fromIds.length > 0)
      : existingReaction
        ? message.reactions.map((reaction) =>
            reaction.emoji === emoji ? { ...reaction, fromIds: [...reaction.fromIds, reactorId] } : reaction
          )
        : [...message.reactions, { emoji, fromIds: [reactorId] }];
    this.messages = this.messages.map((entry) => (entry.id === messageId ? { ...entry, reactions: nextReactions } : entry));
    return true;
  }

  canDelete(message: ChatMessageEntry): boolean {
    return message.self || this.isRoomCreator();
  }

  deleteMessage(id: string): void {
    this.messages = this.messages.filter((message) => message.id !== id);
    for (const member of this.registry.values()) {
      if (member.authenticated) sendTo(member.conn, { type: 'delete-message', id });
    }
    this.emitMessages();
  }

  receiveDelete(fromId: string, id: string): void {
    const message = this.messages.find((entry) => entry.id === id);
    if (!message) return;
    const isOwnMessage = message.fromId === fromId;
    const isRoomCreator = this.getRoomCode() !== null && fromId === this.getRoomCode();
    if (!isOwnMessage && !isRoomCreator) return;
    this.messages = this.messages.filter((entry) => entry.id !== id);
    this.emitMessages();
    this.dispatchEvent(new CustomEvent('message-deleted-remote', { detail: { id } }));
  }

  clear(): void {
    this.messages = [];
    this.emitMessages();
  }

  getMessages(): ChatMessageEntry[] {
    return this.messages;
  }

  private emitMessages(): void {
    this.dispatchEvent(new CustomEvent('message-added', { detail: { messages: this.messages } }));
  }
}
