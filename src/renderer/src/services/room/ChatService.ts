import { sendTo } from '@/services/room/peerSession';
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
}

interface ChatServiceDeps {
  registry: MemberRegistry;
  getSelfName: () => string;
}

export class ChatService extends EventTarget {
  private registry: MemberRegistry;
  private getSelfName: () => string;
  private messages: ChatMessageEntry[] = [];

  constructor({ registry, getSelfName }: ChatServiceDeps) {
    super();
    this.registry = registry;
    this.getSelfName = getSelfName;
  }

  send(text: string): void {
    const entry: ChatMessageEntry = {
      id: crypto.randomUUID(),
      fromId: 'self',
      fromName: this.getSelfName(),
      text,
      self: true,
      sentAt: Date.now()
    };
    this.messages = [...this.messages, entry];
    for (const member of this.registry.values()) {
      if (member.authenticated) sendTo(member.conn, { type: 'chat', text });
    }
    this.emitMessages();
  }

  receive(fromId: string, text: string): void {
    const member = this.registry.get(fromId);
    const entry: ChatMessageEntry = {
      id: crypto.randomUUID(),
      fromId,
      fromName: member?.name || fromId,
      text,
      self: false,
      sentAt: Date.now()
    };
    this.messages = [...this.messages, entry];
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
