import type { z } from 'zod';
import { safeCall } from '@/services/room/peerSession';
import type { MemberRegistry } from '@/services/room/MemberRegistry';
import type { MembershipGossip } from '@/services/room/MembershipGossip';
import type { MediaSharing } from '@/services/room/MediaSharing';
import type { ChatService } from '@/services/room/ChatService';
import {
  roomMessageSchema,
  helloMessageSchema,
  membersMessageSchema,
  sharingStatusMessageSchema,
  watchRequestMessageSchema,
  unwatchRequestMessageSchema,
  kickMessageSchema,
  chatMessageSchema
} from '@/services/room/roomMessage.schema';

export type HelloMessage = z.infer<typeof helloMessageSchema>;
export type MembersMessage = z.infer<typeof membersMessageSchema>;
export type SharingStatusMessage = z.infer<typeof sharingStatusMessageSchema>;
export type WatchRequestMessage = z.infer<typeof watchRequestMessageSchema>;
export type UnwatchRequestMessage = z.infer<typeof unwatchRequestMessageSchema>;
export type KickMessage = z.infer<typeof kickMessageSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type RoomMessage = z.infer<typeof roomMessageSchema>;

interface RoomProtocolDeps {
  registry: MemberRegistry;
  gossip: MembershipGossip;
  media: MediaSharing;
  chat: ChatService;
  onMembersChanged: () => void;
  getExpectedPassword: () => string;
  onAuthRejected: (fromId: string) => void;
  onAuthSuccess: (fromId: string) => void;
  onKick: (targetId: string) => void;
}

export class RoomProtocol {
  private deps: RoomProtocolDeps;

  constructor(deps: RoomProtocolDeps) {
    this.deps = deps;
  }

  handleMessage(fromId: string, message: RoomMessage): void {
    if (message.type === 'hello') {
      this.handleHello(fromId, message);
      return;
    }
    if (!this.deps.registry.get(fromId)?.authenticated) return;
    switch (message.type) {
      case 'members':
        this.deps.gossip.handleMembersMessage(message.members);
        this.deps.onMembersChanged();
        return;
      case 'sharing-status':
        this.handleSharingStatus(fromId, message);
        return;
      case 'watch-request':
        this.deps.media.handleWatchRequest(fromId);
        return;
      case 'unwatch-request':
        this.deps.media.handleUnwatchRequest(fromId);
        return;
      case 'kick':
        this.deps.onKick(message.targetId);
        return;
      case 'chat':
        this.deps.chat.receive(fromId, message.text);
        return;
    }
  }

  private handleHello(fromId: string, message: HelloMessage): void {
    if (message.password !== this.deps.getExpectedPassword()) {
      this.deps.onAuthRejected(fromId);
      return;
    }
    this.deps.registry.upsert(fromId, { name: message.name, authenticated: true });
    this.deps.onAuthSuccess(fromId);
  }

  private handleSharingStatus(fromId: string, message: SharingStatusMessage): void {
    const member = this.deps.registry.get(fromId);
    const patch: Parameters<MemberRegistry['upsert']>[1] = { sharing: message.sharing };
    if (!message.sharing) {
      if (member?.mediaConnIn) safeCall(member.mediaConnIn, 'close');
      Object.assign(patch, { watching: false, stream: null, mediaConnIn: null });
    }
    this.deps.registry.upsert(fromId, patch);
    this.deps.onMembersChanged();
  }
}
