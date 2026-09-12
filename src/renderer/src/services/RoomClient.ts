import type { DataConnection, MediaConnection } from 'peerjs';
import { getIceServers } from '@/services/room/turnCredentials';
import { randomRoomCode, sendTo, safeCall } from '@/services/room/peerSession';
import { MemberRegistry, type MemberSnapshot } from '@/services/room/MemberRegistry';
import { MembershipGossip } from '@/services/room/MembershipGossip';
import { MediaSharing, type OutgoingCallDetail } from '@/services/room/MediaSharing';
import { ChatService, type ChatMessageEntry, type ChatServiceEventDetail } from '@/services/room/ChatService';
import { PeerConnectionManager } from '@/services/room/PeerConnectionManager';
import {
  RoomProtocol,
  type HelloMessage,
  type SharingStatusMessage,
  type WatchRequestMessage,
  type UnwatchRequestMessage,
  type KickMessage,
  type JoinPendingMessage,
  type JoinApprovedMessage
} from '@/services/room/RoomProtocol';
import { onTyped } from '@/lib/typedEvents';
import { RoomStatus } from '@/constants/roomStatus';
import { AUTH_HELLO_TIMEOUT_MS, ICE_CONNECTION_TIMEOUT_MS, JOIN_APPROVAL_TIMEOUT_MS } from '@/constants/timing';
import type { QualitySettings } from '@/services/ScreenCapture';

const DEFAULT_MEMBER_NAME = 'Sem nome';
const JOIN_CONFIRMATION_TIMEOUT_MS = ICE_CONNECTION_TIMEOUT_MS + AUTH_HELLO_TIMEOUT_MS + JOIN_APPROVAL_TIMEOUT_MS;

interface PendingJoin {
  peerId: string;
  resolve: () => void;
  reject: (error: Error) => void;
}

export interface JoinRequestEntry {
  id: string;
  name: string;
}

export interface RoomClientEventDetail {
  'sharing-changed': { sharing: boolean };
  'outgoing-call': { peerId: string; call: MediaConnection; quality: QualitySettings | null };
  'members-changed': { members: MemberSnapshot[] };
  'status-changed': { status: RoomStatus };
  'connection-warning': { peerId: string };
  'chat-changed': { messages: ChatMessageEntry[] };
  'join-requests-changed': { requests: JoinRequestEntry[] };
  'join-pending': Record<string, never>;
}

export class RoomClient extends EventTarget {
  private selfName = DEFAULT_MEMBER_NAME;
  private currentPassword = '';
  private blockedIds = new Set<string>();
  private pendingJoin: PendingJoin | null = null;
  private pendingJoinRequests = new Map<string, string>();
  private cachedJoinRequestsSnapshot: JoinRequestEntry[] = [];
  roomCode: string | null = null;
  status: RoomStatus = RoomStatus.DISCONNECTED;

  private registry = new MemberRegistry();
  private gossip: MembershipGossip;
  private media: MediaSharing;
  private chat: ChatService;
  private protocol: RoomProtocol;
  private connections: PeerConnectionManager;
  private cachedMembersSnapshot: MemberSnapshot[] = [];

  constructor() {
    super();
    this.gossip = new MembershipGossip({
      registry: this.registry,
      getSelfId: () => this.connections.getSelfId(),
      getSelfName: () => this.selfName,
      connectToPeer: (id) => this.connections.connectToPeer(id)
    });
    this.media = new MediaSharing({ registry: this.registry, getPeer: () => this.connections.getPeer() });
    this.chat = new ChatService({ registry: this.registry, getSelfName: () => this.selfName });
    this.protocol = new RoomProtocol({
      registry: this.registry,
      gossip: this.gossip,
      media: this.media,
      chat: this.chat,
      onMembersChanged: () => this.emitMembers(),
      getExpectedPassword: () => this.currentPassword,
      isRoomCreator: () => this.isRoomCreator,
      onAuthRejected: (id) => this.handleAuthRejected(id),
      onAuthSuccess: (id) => this.handleAuthSuccess(id),
      onJoinRequest: (id, name) => this.handleJoinRequest(id, name),
      onJoinPending: (id) => this.handleJoinPending(id),
      onJoinApproved: (id) => this.handleJoinApproved(id),
      onKick: (id) => this.applyKick(id)
    });
    this.connections = new PeerConnectionManager({
      isKnownMember: (id) => this.registry.has(id),
      isAuthenticatedMember: (id) => this.registry.get(id)?.authenticated === true,
      isBlocked: (id) => this.blockedIds.has(id),
      onMemberConnectionOpen: (id, connection) => this.handleMemberConnectionOpen(id, connection),
      onMessage: (fromId, message) => this.protocol.handleMessage(fromId, message),
      onMemberDisconnected: (id) => this.cleanupMember(id),
      onIncomingStream: (fromId, call, stream) => {
        this.registry.upsert(fromId, { stream, mediaConnIn: call });
        this.emitMembers();
      },
      onIncomingStreamClosed: (fromId) => {
        this.registry.upsert(fromId, { stream: null, watching: false });
        this.emitMembers();
      },
      onConnectionWarning: (peerId) => {
        this.dispatchEvent(new CustomEvent('connection-warning', { detail: { peerId } }));
        this.rejectPendingJoin(peerId, new Error('Não foi possível conectar com a sala'));
      }
    });
    onTyped<RoomClientEventDetail['sharing-changed']>(this.media, 'sharing-changed', (detail) => {
      this.dispatchEvent(new CustomEvent('sharing-changed', { detail }));
    });
    onTyped<OutgoingCallDetail>(this.media, 'outgoing-call', (detail) => {
      this.dispatchEvent(new CustomEvent('outgoing-call', { detail }));
    });
    onTyped<ChatServiceEventDetail['message-added']>(this.chat, 'message-added', (detail) => {
      this.dispatchEvent(new CustomEvent('chat-changed', { detail }));
    });
  }

  get sharing(): boolean {
    return this.media.sharing;
  }

  get isRoomCreator(): boolean {
    return this.roomCode !== null && this.connections.getSelfId() === this.roomCode;
  }

  get roomPassword(): string {
    return this.currentPassword;
  }

  async createRoom(name: string, password = ''): Promise<string> {
    this.selfName = name || DEFAULT_MEMBER_NAME;
    this.currentPassword = password;
    const iceServers = await getIceServers();
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = randomRoomCode();
      try {
        await this.connections.open(code, iceServers);
        this.roomCode = code;
        this.emitStatus(RoomStatus.CONNECTED);
        return code;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Não foi possível criar a sala');
  }

  async joinRoom(name: string, code: string, password = ''): Promise<string> {
    this.selfName = name || DEFAULT_MEMBER_NAME;
    this.currentPassword = password;
    const iceServers = await getIceServers();
    await this.connections.open(undefined, iceServers);
    try {
      await new Promise<void>((resolve, reject) => {
        this.pendingJoin = { peerId: code, resolve, reject };
        setTimeout(() => this.rejectPendingJoin(code, new Error('Código ou senha incorretos')), JOIN_CONFIRMATION_TIMEOUT_MS);
        this.connections.connectToPeer(code);
      });
    } catch (error) {
      this.connections.close();
      throw error;
    }
    this.roomCode = code;
    this.emitStatus(RoomStatus.CONNECTED);
    return code;
  }

  leaveRoom(): void {
    this.media.stop();
    for (const member of this.registry.values()) {
      if (member.conn) safeCall(member.conn, 'close');
      if (member.mediaConnIn) safeCall(member.mediaConnIn, 'close');
    }
    for (const id of [...this.registry.ids()]) this.registry.remove(id);
    this.blockedIds.clear();
    this.pendingJoinRequests.clear();
    this.emitJoinRequests();
    this.chat.clear();
    this.connections.close();
    this.roomCode = null;
    this.emitStatus(RoomStatus.DISCONNECTED);
  }

  sendChatMessage(text: string): void {
    this.chat.send(text);
  }

  getChatMessages(): ChatMessageEntry[] {
    return this.chat.getMessages();
  }

  kickMember(id: string): void {
    if (!this.isRoomCreator) return;
    for (const [memberId, member] of this.registry.entries()) {
      if (memberId !== id) sendTo(member.conn, { type: 'kick', targetId: id } as KickMessage);
    }
    this.applyKick(id);
  }

  startSharing(stream: MediaStream, quality: QualitySettings): void {
    this.media.start(stream, quality);
  }

  stopSharing(): void {
    this.media.stop();
  }

  toggleWatch(id: string): void {
    const member = this.registry.get(id);
    if (!member) return;
    if (!member.watching) {
      this.registry.upsert(id, { watching: true });
      sendTo(member.conn, { type: 'watch-request' } as WatchRequestMessage);
    } else {
      if (member.mediaConnIn) safeCall(member.mediaConnIn, 'close');
      this.registry.upsert(id, { watching: false, mediaConnIn: null, stream: null });
      sendTo(member.conn, { type: 'unwatch-request' } as UnwatchRequestMessage);
    }
    this.emitMembers();
  }

  getMembersSnapshot(): MemberSnapshot[] {
    return this.cachedMembersSnapshot;
  }

  getPendingJoinRequests(): JoinRequestEntry[] {
    return this.cachedJoinRequestsSnapshot;
  }

  approveJoinRequest(id: string): void {
    if (!this.pendingJoinRequests.has(id)) return;
    this.pendingJoinRequests.delete(id);
    this.emitJoinRequests();
    this.registry.upsert(id, { authenticated: true });
    this.handleAuthSuccess(id);
    sendTo(this.registry.get(id)?.conn, { type: 'join-approved' } as JoinApprovedMessage);
  }

  denyJoinRequest(id: string): void {
    if (!this.pendingJoinRequests.has(id)) return;
    this.pendingJoinRequests.delete(id);
    this.emitJoinRequests();
    this.handleAuthRejected(id);
  }

  private handleMemberConnectionOpen(id: string, connection: DataConnection): void {
    const currentName = this.registry.get(id)?.name || id;
    this.registry.upsert(id, { conn: connection, name: currentName });
    sendTo(connection, { type: 'hello', name: this.selfName, password: this.currentPassword } as HelloMessage);
    if (this.media.sharing) sendTo(connection, { type: 'sharing-status', sharing: true } as SharingStatusMessage);
    this.scheduleAuthTimeout(id);
  }

  private scheduleAuthTimeout(id: string): void {
    setTimeout(() => {
      const member = this.registry.get(id);
      if (member && !member.authenticated && !this.pendingJoinRequests.has(id)) this.handleAuthRejected(id);
    }, AUTH_HELLO_TIMEOUT_MS);
  }

  private handleJoinRequest(id: string, name: string): void {
    this.pendingJoinRequests.set(id, name);
    this.emitJoinRequests();
    const member = this.registry.get(id);
    sendTo(member?.conn, { type: 'join-pending' } as JoinPendingMessage);
    setTimeout(() => {
      if (this.pendingJoinRequests.has(id)) this.denyJoinRequest(id);
    }, JOIN_APPROVAL_TIMEOUT_MS);
  }

  private handleJoinPending(_id: string): void {
    this.dispatchEvent(new CustomEvent('join-pending', { detail: {} }));
  }

  private handleJoinApproved(id: string): void {
    this.resolvePendingJoin(id);
  }

  private emitJoinRequests(): void {
    this.cachedJoinRequestsSnapshot = Array.from(this.pendingJoinRequests, ([id, name]) => ({ id, name }));
    this.dispatchEvent(new CustomEvent('join-requests-changed', { detail: { requests: this.cachedJoinRequestsSnapshot } }));
  }

  private handleAuthRejected(id: string): void {
    const member = this.registry.get(id);
    if (member?.conn) safeCall(member.conn, 'close');
    this.registry.remove(id);
    this.rejectPendingJoin(id, new Error('Código ou senha incorretos'));
  }

  private handleAuthSuccess(_id: string): void {
    this.emitMembers();
    this.gossip.broadcast();
  }

  private resolvePendingJoin(peerId: string): void {
    if (this.pendingJoin?.peerId !== peerId) return;
    this.pendingJoin.resolve();
    this.pendingJoin = null;
  }

  private rejectPendingJoin(peerId: string, error: Error): void {
    if (this.pendingJoin?.peerId !== peerId) return;
    this.pendingJoin.reject(error);
    this.pendingJoin = null;
  }

  private applyKick(targetId: string): void {
    this.blockedIds.add(targetId);
    const member = this.registry.get(targetId);
    if (member?.conn) safeCall(member.conn, 'close');
    if (member?.mediaConnIn) safeCall(member.mediaConnIn, 'close');
    this.registry.remove(targetId);
    this.emitMembers();
  }

  private cleanupMember(id: string): void {
    const member = this.registry.get(id);
    if (member?.mediaConnIn) safeCall(member.mediaConnIn, 'close');
    this.media.removeViewer(id);
    this.registry.remove(id);
    if (this.pendingJoinRequests.delete(id)) this.emitJoinRequests();
    this.rejectPendingJoin(id, new Error('Não foi possível entrar na sala'));
    this.emitMembers();
  }

  private emitMembers(): void {
    this.cachedMembersSnapshot = this.registry.snapshot();
    this.dispatchEvent(new CustomEvent('members-changed', { detail: { members: this.cachedMembersSnapshot } }));
  }

  private emitStatus(status: RoomStatus): void {
    this.status = status;
    this.dispatchEvent(new CustomEvent('status-changed', { detail: { status } }));
  }
}
