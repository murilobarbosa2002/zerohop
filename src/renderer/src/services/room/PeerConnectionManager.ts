import Peer, { type DataConnection, type MediaConnection } from 'peerjs';
import { createPeer, safeCall, sendTo } from '@/services/room/peerSession';
import { watchConnection, watchForRealDisconnect } from '@/services/room/iceDiagnostics';
import { roomMessageSchema } from '@/services/room/roomMessage.schema';
import { ICE_CONNECTION_TIMEOUT_MS, PEER_RECONNECT_MAX_RETRIES, PEER_RECONNECT_RETRY_DELAY_MS, INVITE_SEND_TIMEOUT_MS } from '@/constants/timing';
import { CallKind } from '@/constants/callKind';
import { logEvent } from '@/services/appLog';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import type { RoomMessage, InviteMessage, InviteRejectedMessage } from '@/services/room/RoomProtocol';

interface PeerConnectionManagerDeps {
  isKnownMember: (id: string) => boolean;
  isAuthenticatedMember: (id: string) => boolean;
  isBlocked: (id: string) => boolean;
  onMemberConnectionOpen: (id: string, connection: DataConnection) => void;
  onMessage: (fromId: string, message: RoomMessage) => void;
  onInviteMessage: (fromId: string, message: InviteMessage, connection: DataConnection) => void;
  onInviteSendFailed: (id: string) => void;
  onInviteRejected: (id: string, reason: InviteRejectedMessage['reason']) => void;
  onMemberDisconnected: (id: string) => void;
  onIncomingStream: (fromId: string, call: MediaConnection, stream: MediaStream) => void;
  onIncomingStreamClosed: (fromId: string) => void;
  onIncomingVoiceStream: (fromId: string, call: MediaConnection, stream: MediaStream) => void;
  onIncomingVoiceStreamClosed: (fromId: string) => void;
  onConnectionWarning: (peerId: string) => void;
}

export class PeerConnectionManager {
  private deps: PeerConnectionManagerDeps;
  private peer: Peer | null = null;
  private selfId: string | null = null;

  constructor(deps: PeerConnectionManagerDeps) {
    this.deps = deps;
  }

  async open(desiredId: string | undefined, iceServers: RTCIceServer[]): Promise<string> {
    this.peer = await createPeer(desiredId, iceServers);
    this.selfId = this.peer.id;
    this.setupPeerHandlers();
    return this.selfId;
  }

  close(): void {
    if (this.peer) safeCall(this.peer, 'destroy');
    this.peer = null;
    this.selfId = null;
  }

  getPeer(): Peer | null {
    return this.peer;
  }

  getSelfId(): string | null {
    return this.selfId;
  }

  connectToPeer(id: string): void {
    if (!this.peer || id === this.selfId || this.deps.isKnownMember(id) || this.deps.isBlocked(id)) return;
    this.openOutgoingConnection(id, 0);
  }

  sendInvite(id: string, message: InviteMessage): void {
    if (!this.peer || id === this.selfId) return;
    const connection = this.peer.connect(id, { reliable: true });
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      safeCall(connection, 'close');
      this.deps.onInviteSendFailed(id);
    }, INVITE_SEND_TIMEOUT_MS);
    connection.on('open', () => {
      sendTo(connection, message);
    });
    connection.on('data', (data) => {
      if (settled) return;
      const parsed = roomMessageSchema.safeParse(data);
      if (!parsed.success || parsed.data.type !== 'invite-rejected') return;
      settled = true;
      clearTimeout(timeout);
      this.deps.onInviteRejected(id, parsed.data.reason);
      safeCall(connection, 'close');
    });
    connection.on('close', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
    });
    connection.on('error', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      this.deps.onInviteSendFailed(id);
    });
  }

  private openOutgoingConnection(id: string, attempt: number): void {
    if (!this.peer) return;
    const connection = this.peer.connect(id, { reliable: true });
    watchConnection(connection, 'saindo->' + id, ICE_CONNECTION_TIMEOUT_MS, () => {
      this.deps.onConnectionWarning(id);
      if (attempt < PEER_RECONNECT_MAX_RETRIES && this.deps.isKnownMember(id) && !this.deps.isBlocked(id)) {
        setTimeout(() => this.openOutgoingConnection(id, attempt + 1), PEER_RECONNECT_RETRY_DELAY_MS);
      }
    });
    this.registerDataConnection(connection);
  }

  private registerDataConnection(connection: DataConnection): void {
    connection.on('open', () => this.deps.onMemberConnectionOpen(connection.peer, connection));
    connection.on('data', (data) => {
      const parsed = roomMessageSchema.safeParse(data);
      if (!parsed.success) {
        console.warn('[room] mensagem descartada por não seguir o protocolo esperado', parsed.error.issues);
        logEvent(LogCategory.CONNECTION, LogLevel.WARNING, LOG_STRINGS.invalidMessageDiscardedMessage, JSON.stringify(parsed.error.issues));
        return;
      }
      if (parsed.data.type === 'invite') {
        this.deps.onInviteMessage(connection.peer, parsed.data, connection);
        return;
      }
      this.deps.onMessage(connection.peer, parsed.data);
    });
    connection.on('close', () => this.deps.onMemberDisconnected(connection.peer));
    connection.on('error', () => this.deps.onMemberDisconnected(connection.peer));
    watchForRealDisconnect(connection, connection.peer, () => this.deps.onMemberDisconnected(connection.peer));
  }

  private setupPeerHandlers(): void {
    if (!this.peer) return;
    this.peer.on('connection', (connection) => {
      if (this.deps.isBlocked(connection.peer)) {
        safeCall(connection, 'close');
        return;
      }
      watchConnection(connection, 'entrando<-' + connection.peer, ICE_CONNECTION_TIMEOUT_MS, () => {});
      this.registerDataConnection(connection);
    });
    this.peer.on('call', (call) => {
      if (this.deps.isBlocked(call.peer) || !this.deps.isAuthenticatedMember(call.peer)) return;
      call.answer();
      const isVoiceCall = (call.metadata as { kind?: CallKind } | undefined)?.kind === CallKind.VOICE;
      if (isVoiceCall) {
        call.on('stream', (stream) => this.deps.onIncomingVoiceStream(call.peer, call, stream));
        call.on('close', () => this.deps.onIncomingVoiceStreamClosed(call.peer));
        return;
      }
      call.on('stream', (stream) => this.deps.onIncomingStream(call.peer, call, stream));
      call.on('close', () => this.deps.onIncomingStreamClosed(call.peer));
    });
    this.peer.on('error', (error) => {
      console.error(error);
      logEvent(LogCategory.CONNECTION, LogLevel.ERROR, LOG_STRINGS.peerErrorMessage, error.message);
    });
  }
}
