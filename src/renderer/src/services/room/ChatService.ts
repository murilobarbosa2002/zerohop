import { sendTo } from '@/services/room/peerSession';
import { SELF_SENDER_ID } from '@/constants/chat';
import type { MemberRegistry } from '@/services/room/MemberRegistry';

export interface ChatMessageEntry {
  id: string;
  fromId: string;
  fromName: string;
  text: string;
  self: boolean;
  sentAt: number;
}

export interface ChatServiceEventDetail {
  'message-added': { messages: ChatMessageEntry[] };
  'message-received': { message: ChatMessageEntry };
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

  send(text: string): void {
    const id = crypto.randomUUID();
    const entry: ChatMessageEntry = {
      id,
      fromId: SELF_SENDER_ID,
      fromName: this.getSelfName(),
      text,
      self: true,
      sentAt: Date.now()
    };
    this.messages = [...this.messages, entry];
    for (const member of this.registry.values()) {
      if (member.authenticated) sendTo(member.conn, { type: 'chat', id, text });
    }
    this.emitMessages();
  }

  receive(fromId: string, id: string, text: string): void {
    const member = this.registry.get(fromId);
    const entry: ChatMessageEntry = {
      id,
      fromId,
      fromName: member?.name || fromId,
      text,
      self: false,
      sentAt: Date.now()
    };
    this.messages = [...this.messages, entry];
    this.emitMessages();
    this.dispatchEvent(new CustomEvent('message-received', { detail: { message: entry } }));
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
