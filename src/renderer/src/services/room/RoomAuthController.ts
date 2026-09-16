import type { DataConnection } from 'peerjs';
import { sendTo, safeCall } from '@/services/room/peerSession';
import type { MemberRegistry } from '@/services/room/MemberRegistry';
import type { MembershipGossip } from '@/services/room/MembershipGossip';
import type { HelloMessage, JoinPendingMessage, JoinApprovedMessage } from '@/services/room/RoomProtocol';
import { AUTH_HELLO_TIMEOUT_MS, JOIN_APPROVAL_TIMEOUT_MS } from '@/constants/timing';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { AvatarId } from '@/constants/avatars';

interface PendingJoin {
  peerId: string;
  resolve: () => void;
  reject: (error: Error) => void;
}

export interface JoinRequestEntry {
  id: string;
  name: string;
}

export interface RoomAuthControllerEventDetail {
  'join-requests-changed': { requests: JoinRequestEntry[] };
  'join-pending': Record<string, never>;
}

interface RoomAuthControllerDeps {
  registry: MemberRegistry;
  gossip: MembershipGossip;
  getSelfName: () => string;
  getSelfAvatarId: () => AvatarId;
  getExpectedPassword: () => string;
  isRoomCreator: () => boolean;
  onMembersChanged: () => void;
  onMemberAuthenticated: (id: string) => void;
  getAppVersion?: () => Promise<string>;
  getInviteToken?: () => string | null;
  onTokenAutoApproved?: (token: string) => void;
}

export class RoomAuthController extends EventTarget {
  private deps: RoomAuthControllerDeps;
  private ownAppVersion = '';
  private ownAppVersionPromise: Promise<string>;
  private pendingJoin: PendingJoin | null = null;
  private pendingJoinRequests = new Map<string, string>();
  private cachedJoinRequestsSnapshot: JoinRequestEntry[] = [];
  private preAuthorizedTokens = new Set<string>();

  constructor(deps: RoomAuthControllerDeps) {
    super();
    this.deps = deps;
    const getAppVersion = deps.getAppVersion ?? (() => window.api.getUpdaterInfo().then((info) => info.version));
    this.ownAppVersionPromise = getAppVersion().then((version) => {
      this.ownAppVersion = version;
      return version;
    });
  }

  getOwnAppVersion(): string {
    return this.ownAppVersion;
  }

  getPendingJoinRequests(): JoinRequestEntry[] {
    return this.cachedJoinRequestsSnapshot;
  }

  beginJoin(peerId: string, timeoutMs: number, connect: () => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.pendingJoin = { peerId, resolve, reject };
      setTimeout(() => this.rejectPendingJoin(peerId, new Error(ROOM_STRINGS.invalidCredentialsError)), timeoutMs);
      connect();
    });
  }

  async sendHello(id: string, connection: DataConnection, sharing: boolean): Promise<void> {
    const appVersion = await this.ownAppVersionPromise;
    const inviteToken = this.deps.getInviteToken?.();
    sendTo(connection, {
      type: 'hello',
      name: this.deps.getSelfName(),
      avatarId: this.deps.getSelfAvatarId(),
      password: this.deps.getExpectedPassword(),
      appVersion,
      ...(inviteToken ? { inviteToken } : {})
    } as HelloMessage);
    if (sharing) sendTo(connection, { type: 'sharing-status', sharing: true });
    this.scheduleAuthTimeout(id);
  }

  approveJoinRequest(id: string): void {
    if (!this.pendingJoinRequests.has(id)) return;
    this.pendingJoinRequests.delete(id);
    this.emitJoinRequests();
    this.autoApprove(id);
  }

  denyJoinRequest(id: string): void {
    if (!this.pendingJoinRequests.has(id)) return;
    this.pendingJoinRequests.delete(id);
    this.emitJoinRequests();
    this.handleAuthRejected(id);
  }

  preAuthorizeToken(token: string): void {
    this.preAuthorizedTokens.add(token);
  }

  handleJoinRequest(id: string, name: string, inviteToken?: string): void {
    if (inviteToken && this.preAuthorizedTokens.delete(inviteToken)) {
      this.autoApprove(id);
      this.deps.onTokenAutoApproved?.(inviteToken);
      return;
    }
    this.pendingJoinRequests.set(id, name);
    this.emitJoinRequests();
    const member = this.deps.registry.get(id);
    sendTo(member?.conn, { type: 'join-pending' } as JoinPendingMessage);
    setTimeout(() => {
      if (this.pendingJoinRequests.has(id)) this.denyJoinRequest(id);
    }, JOIN_APPROVAL_TIMEOUT_MS);
  }

  private autoApprove(id: string): void {
    this.deps.registry.upsert(id, { authenticated: true });
    this.handleAuthSuccess(id);
    sendTo(this.deps.registry.get(id)?.conn, { type: 'join-approved' } as JoinApprovedMessage);
  }

  handleJoinPending(): void {
    this.dispatchEvent(new CustomEvent('join-pending', { detail: {} }));
  }

  handleJoinApproved(id: string): void {
    this.resolvePendingJoin(id);
  }

  handleAuthSuccess(id: string): void {
    this.deps.onMembersChanged();
    this.deps.gossip.broadcast();
    this.deps.onMemberAuthenticated(id);
  }

  handleAuthRejected(id: string): void {
    this.rejectPendingJoin(id, new Error(ROOM_STRINGS.invalidCredentialsError));
    const member = this.deps.registry.get(id);
    if (member?.conn) safeCall(member.conn, 'close');
    this.deps.registry.remove(id);
  }

  handleVersionMismatch(id: string, remoteVersion: string): void {
    this.rejectPendingJoin(id, new Error(ROOM_STRINGS.versionMismatchError(this.ownAppVersion, remoteVersion)));
    const member = this.deps.registry.get(id);
    if (member?.conn) safeCall(member.conn, 'close');
    this.deps.registry.remove(id);
  }

  notifyConnectionFailure(peerId: string): void {
    this.rejectPendingJoin(peerId, new Error(ROOM_STRINGS.connectionFailedError));
  }

  notifyMemberDisconnected(id: string): void {
    if (this.pendingJoinRequests.delete(id)) this.emitJoinRequests();
    this.rejectPendingJoin(id, new Error(ROOM_STRINGS.joinFailedGenericError));
  }

  reset(): void {
    this.pendingJoinRequests.clear();
    this.emitJoinRequests();
  }

  private scheduleAuthTimeout(id: string): void {
    setTimeout(() => {
      const member = this.deps.registry.get(id);
      if (member && !member.authenticated && !this.pendingJoinRequests.has(id)) this.handleAuthRejected(id);
    }, AUTH_HELLO_TIMEOUT_MS);
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

  private emitJoinRequests(): void {
    this.cachedJoinRequestsSnapshot = Array.from(this.pendingJoinRequests, ([id, name]) => ({ id, name }));
    this.dispatchEvent(new CustomEvent('join-requests-changed', { detail: { requests: this.cachedJoinRequestsSnapshot } }));
  }
}
