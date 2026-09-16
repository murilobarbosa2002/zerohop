import type { DataConnection, MediaConnection } from 'peerjs';
import { getIceServers } from '@/services/room/turnCredentials';
import { randomRoomCode, sendTo, safeCall } from '@/services/room/peerSession';
import { MemberRegistry, type MemberSnapshot } from '@/services/room/MemberRegistry';
import { MembershipGossip } from '@/services/room/MembershipGossip';
import { MediaSharing, type OutgoingCallDetail } from '@/services/room/MediaSharing';
import { VoiceChat } from '@/services/room/VoiceChat';
import { ChatService, type ChatMessageEntry, type ChatServiceEventDetail } from '@/services/room/ChatService';
import { RoomAuthController, type JoinRequestEntry, type RoomAuthControllerEventDetail } from '@/services/room/RoomAuthController';
import { PeerConnectionManager } from '@/services/room/PeerConnectionManager';
import {
  RoomProtocol,
  type WatchRequestMessage,
  type UnwatchRequestMessage,
  type KickMessage,
  type InviteMessage
} from '@/services/room/RoomProtocol';
import { captureMicrophone } from '@/services/MicCapture';
import {
  getMicInputDeviceId,
  subscribeToMicInputDevice,
  getMicInputGain,
  subscribeToMicInputGain,
  getNoiseSuppressionEnabled,
  subscribeToNoiseSuppression
} from '@/services/micInputPreference';
import { getPersonalId } from '@/services/personalRoomPreference';
import { logEvent } from '@/services/appLog';
import { onTyped } from '@/lib/typedEvents';
import { RoomStatus } from '@/constants/roomStatus';
import {
  AUTH_HELLO_TIMEOUT_MS,
  ICE_CONNECTION_TIMEOUT_MS,
  JOIN_APPROVAL_TIMEOUT_MS,
  ROOM_CODE_CREATE_MAX_ATTEMPTS
} from '@/constants/timing';
import { ROOM_STRINGS } from '@/strings/room.strings';
import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { DEFAULT_AVATAR_ID, normalizeAvatarId } from '@/constants/avatars';
import type { AvatarId } from '@/constants/avatars';
import type { QualitySettings } from '@/services/ScreenCapture';
import type { MicCaptureHandle } from '@/services/MicCapture.types';
import type { Contact } from '@shared/contact';

const JOIN_CONFIRMATION_TIMEOUT_MS = ICE_CONNECTION_TIMEOUT_MS + AUTH_HELLO_TIMEOUT_MS + JOIN_APPROVAL_TIMEOUT_MS;

export type { JoinRequestEntry };

export interface RoomClientEventDetail {
  'sharing-changed': { sharing: boolean };
  'outgoing-call': { peerId: string; call: MediaConnection; quality: QualitySettings | null };
  'members-changed': { members: MemberSnapshot[] };
  'status-changed': { status: RoomStatus };
  'connection-warning': { peerId: string };
  'chat-changed': { messages: ChatMessageEntry[] };
  'chat-message-received': { message: ChatMessageEntry };
  'chat-message-deleted-remote': { id: string };
  'join-requests-changed': { requests: JoinRequestEntry[] };
  'join-pending': Record<string, never>;
  'mic-muted-changed': { muted: boolean };
  'mic-active-changed': { active: boolean };
  'member-joined': { id: string; name: string };
  'member-left': { id: string; name: string };
  'invite-received': {
    fromId: string;
    roomCode: string;
    roomPassword: string;
    inviteToken: string;
    hostName: string;
    hostAvatarId: AvatarId;
  };
}

export class RoomClient extends EventTarget {
  private selfName: string = PARTICIPANTS_STRINGS.defaultMemberName;
  private selfAvatarId: AvatarId = DEFAULT_AVATAR_ID;
  private currentPassword = '';
  private blockedIds = new Set<string>();
  roomCode: string | null = null;
  status: RoomStatus = RoomStatus.DISCONNECTED;

  private registry = new MemberRegistry();
  private gossip: MembershipGossip;
  private media: MediaSharing;
  private voice: VoiceChat;
  private micCapture: MicCaptureHandle | null = null;
  private unsubscribeMicGain: (() => void) | null = null;
  private unsubscribeMicDevice: (() => void) | null = null;
  private unsubscribeNoiseSuppression: (() => void) | null = null;
  private chat: ChatService;
  private auth: RoomAuthController;
  private protocol: RoomProtocol;
  private connections: PeerConnectionManager;
  private cachedMembersSnapshot: MemberSnapshot[] = [];
  private pendingInviteToken: string | null = null;
  private inviteTokenToContactId = new Map<string, string>();
  private joinedAutoInviteContactIds = new Set<string>();

  constructor() {
    super();
    this.gossip = new MembershipGossip({
      registry: this.registry,
      getSelfId: () => this.connections.getSelfId(),
      getSelfName: () => this.selfName,
      getSelfAvatarId: () => this.selfAvatarId,
      connectToPeer: (id) => this.connections.connectToPeer(id)
    });
    this.media = new MediaSharing({ registry: this.registry, getPeer: () => this.connections.getPeer() });
    this.voice = new VoiceChat({ registry: this.registry, getPeer: () => this.connections.getPeer() });
    this.chat = new ChatService({
      registry: this.registry,
      getSelfName: () => this.selfName,
      getRoomCode: () => this.roomCode,
      isRoomCreator: () => this.isRoomCreator
    });
    this.auth = new RoomAuthController({
      registry: this.registry,
      gossip: this.gossip,
      getSelfName: () => this.selfName,
      getSelfAvatarId: () => this.selfAvatarId,
      getExpectedPassword: () => this.currentPassword,
      isRoomCreator: () => this.isRoomCreator,
      onMembersChanged: () => this.emitMembers(),
      onMemberAuthenticated: (id) => {
        this.voice.callMember(id);
        const member = this.registry.get(id);
        logEvent(LogCategory.ROOM, LogLevel.INFO, LOG_STRINGS.memberJoinedMessage(member?.name || id));
        this.dispatchEvent(new CustomEvent('member-joined', { detail: { id, name: member?.name || id } }));
      },
      getInviteToken: () => this.pendingInviteToken,
      onTokenAutoApproved: (token) => {
        const contactId = this.inviteTokenToContactId.get(token);
        if (!contactId) return;
        this.inviteTokenToContactId.delete(token);
        this.joinedAutoInviteContactIds.add(contactId);
      }
    });
    this.protocol = new RoomProtocol({
      registry: this.registry,
      gossip: this.gossip,
      media: this.media,
      chat: this.chat,
      onMembersChanged: () => this.emitMembers(),
      getExpectedPassword: () => this.currentPassword,
      getOwnAppVersion: () => this.auth.getOwnAppVersion(),
      isRoomCreator: () => this.isRoomCreator,
      onAuthRejected: (id) => this.auth.handleAuthRejected(id),
      onAuthSuccess: (id) => this.auth.handleAuthSuccess(id),
      onVersionMismatch: (id, remoteVersion) => this.auth.handleVersionMismatch(id, remoteVersion),
      onJoinRequest: (id, name, inviteToken) => this.auth.handleJoinRequest(id, name, inviteToken),
      onJoinPending: () => this.auth.handleJoinPending(),
      onJoinApproved: (id) => this.auth.handleJoinApproved(id),
      onKick: (id) => this.applyKick(id)
    });
    this.connections = new PeerConnectionManager({
      isKnownMember: (id) => this.registry.has(id),
      isAuthenticatedMember: (id) => this.registry.get(id)?.authenticated === true,
      isBlocked: (id) => this.blockedIds.has(id),
      onMemberConnectionOpen: (id, connection) => this.handleMemberConnectionOpen(id, connection),
      onMessage: (fromId, message) => this.protocol.handleMessage(fromId, message),
      onInviteMessage: (fromId, message) => this.handleInviteMessage(fromId, message),
      onMemberDisconnected: (id) => this.cleanupMember(id),
      onIncomingStream: (fromId, call, stream) => {
        this.registry.upsert(fromId, { stream, mediaConnIn: call });
        this.emitMembers();
      },
      onIncomingStreamClosed: (fromId) => {
        this.registry.upsert(fromId, { stream: null, watching: false });
        this.emitMembers();
      },
      onIncomingVoiceStream: (fromId, call, stream) => {
        this.registry.upsert(fromId, { voiceStream: stream, voiceConnIn: call });
        this.emitMembers();
      },
      onIncomingVoiceStreamClosed: (fromId) => {
        this.registry.upsert(fromId, { voiceStream: null, voiceConnIn: null });
        this.emitMembers();
      },
      onConnectionWarning: (peerId) => {
        this.dispatchEvent(new CustomEvent('connection-warning', { detail: { peerId } }));
        this.auth.notifyConnectionFailure(peerId);
      }
    });
    onTyped<RoomClientEventDetail['sharing-changed']>(this.media, 'sharing-changed', (detail) => {
      logEvent(LogCategory.SHARING, LogLevel.INFO, detail.sharing ? LOG_STRINGS.sharingStartedMessage : LOG_STRINGS.sharingStoppedMessage);
      this.dispatchEvent(new CustomEvent('sharing-changed', { detail }));
    });
    onTyped<OutgoingCallDetail>(this.media, 'outgoing-call', (detail) => {
      this.dispatchEvent(new CustomEvent('outgoing-call', { detail }));
    });
    onTyped<RoomClientEventDetail['mic-muted-changed']>(this.voice, 'mic-muted-changed', (detail) => {
      logEvent(LogCategory.VOICE, LogLevel.INFO, detail.muted ? LOG_STRINGS.micMutedMessage : LOG_STRINGS.micUnmutedMessage);
      this.dispatchEvent(new CustomEvent('mic-muted-changed', { detail }));
    });
    onTyped<ChatServiceEventDetail['message-added']>(this.chat, 'message-added', (detail) => {
      this.dispatchEvent(new CustomEvent('chat-changed', { detail }));
    });
    onTyped<ChatServiceEventDetail['message-received']>(this.chat, 'message-received', (detail) => {
      this.dispatchEvent(new CustomEvent('chat-message-received', { detail }));
    });
    onTyped<ChatServiceEventDetail['message-deleted-remote']>(this.chat, 'message-deleted-remote', (detail) => {
      this.dispatchEvent(new CustomEvent('chat-message-deleted-remote', { detail }));
    });
    onTyped<RoomAuthControllerEventDetail['join-requests-changed']>(this.auth, 'join-requests-changed', (detail) => {
      this.dispatchEvent(new CustomEvent('join-requests-changed', { detail }));
    });
    onTyped<RoomAuthControllerEventDetail['join-pending']>(this.auth, 'join-pending', (detail) => {
      this.dispatchEvent(new CustomEvent('join-pending', { detail }));
    });
  }

  get sharing(): boolean {
    return this.media.sharing;
  }

  get micMuted(): boolean {
    return this.voice.micMuted;
  }

  get micActive(): boolean {
    return this.micCapture !== null;
  }

  get isRoomCreator(): boolean {
    return this.roomCode !== null && this.connections.getSelfId() === this.roomCode;
  }

  get roomPassword(): string {
    return this.currentPassword;
  }

  setPassword(password: string): void {
    this.currentPassword = password;
  }

  async createRoom(
    name: string,
    password = '',
    avatarId: AvatarId = DEFAULT_AVATAR_ID,
    desiredCode?: string,
    invitedContacts: Contact[] = []
  ): Promise<string> {
    this.selfName = name || PARTICIPANTS_STRINGS.defaultMemberName;
    this.selfAvatarId = avatarId;
    this.currentPassword = password;
    const iceServers = await getIceServers();
    if (desiredCode) {
      await this.connections.open(desiredCode, iceServers);
      this.roomCode = desiredCode;
      this.emitStatus(RoomStatus.CONNECTED);
      this.startVoiceChat();
      this.inviteContacts(invitedContacts);
      logEvent(LogCategory.ROOM, LogLevel.INFO, LOG_STRINGS.roomCreatedMessage(desiredCode));
      return desiredCode;
    }
    let lastError: unknown = null;
    for (let attempt = 0; attempt < ROOM_CODE_CREATE_MAX_ATTEMPTS; attempt++) {
      const code = randomRoomCode();
      try {
        await this.connections.open(code, iceServers);
        this.roomCode = code;
        this.emitStatus(RoomStatus.CONNECTED);
        this.startVoiceChat();
        this.inviteContacts(invitedContacts);
        logEvent(LogCategory.ROOM, LogLevel.INFO, LOG_STRINGS.roomCreatedMessage(code));
        return code;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError instanceof Error ? lastError : new Error(ROOM_STRINGS.createRoomFailedError);
  }

  async joinRoom(name: string, code: string, password = '', avatarId: AvatarId = DEFAULT_AVATAR_ID, inviteToken?: string): Promise<string> {
    this.selfName = name || PARTICIPANTS_STRINGS.defaultMemberName;
    this.selfAvatarId = avatarId;
    this.currentPassword = password;
    this.pendingInviteToken = inviteToken ?? null;
    const iceServers = await getIceServers();
    await this.connections.open(undefined, iceServers);
    try {
      await this.auth.beginJoin(code, JOIN_CONFIRMATION_TIMEOUT_MS, () => this.connections.connectToPeer(code));
    } catch (error) {
      this.connections.close();
      throw error;
    }
    this.roomCode = code;
    this.emitStatus(RoomStatus.CONNECTED);
    this.startVoiceChat();
    logEvent(LogCategory.ROOM, LogLevel.INFO, LOG_STRINGS.roomJoinedMessage(code));
    return code;
  }

  leaveRoom(): void {
    logEvent(LogCategory.ROOM, LogLevel.INFO, LOG_STRINGS.roomLeftMessage);
    this.media.stop();
    this.stopVoiceChat();
    for (const member of this.registry.values()) {
      if (member.conn) safeCall(member.conn, 'close');
      if (member.mediaConnIn) safeCall(member.mediaConnIn, 'close');
      if (member.voiceConnIn) safeCall(member.voiceConnIn, 'close');
    }
    for (const id of [...this.registry.ids()]) this.registry.remove(id);
    this.blockedIds.clear();
    this.auth.reset();
    this.chat.clear();
    this.connections.close();
    this.roomCode = null;
    this.emitStatus(RoomStatus.DISCONNECTED);
  }

  toggleMicMuted(): void {
    this.setMicMuted(!this.voice.micMuted);
  }

  setMicMuted(muted: boolean): void {
    if (this.voice.micMuted === muted) return;
    this.voice.setMicMuted(muted);
    this.micCapture?.setMuted(muted);
  }

  sendChatMessage(text: string): void {
    this.chat.send(text);
  }

  deleteChatMessage(id: string): void {
    this.chat.deleteMessage(id);
  }

  canDeleteChatMessage(message: ChatMessageEntry): boolean {
    return this.chat.canDelete(message);
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

  changeSharing(stream: MediaStream, quality: QualitySettings): void {
    this.media.replaceStream(stream, quality);
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
    return this.auth.getPendingJoinRequests();
  }

  approveJoinRequest(id: string): void {
    this.auth.approveJoinRequest(id);
  }

  denyJoinRequest(id: string): void {
    this.auth.denyJoinRequest(id);
  }

  private async handleMemberConnectionOpen(id: string, connection: DataConnection): Promise<void> {
    const currentName = this.registry.get(id)?.name || id;
    this.registry.upsert(id, { conn: connection, name: currentName });
    await this.auth.sendHello(id, connection, this.media.sharing);
  }

  inviteContact(contact: Contact): void {
    if (!this.roomCode) return;
    const inviteToken = crypto.randomUUID();
    this.auth.preAuthorizeToken(inviteToken);
    this.inviteTokenToContactId.set(inviteToken, contact.id);
    this.connections.sendInvite(contact.id, {
      type: 'invite',
      roomCode: this.roomCode,
      roomPassword: this.currentPassword,
      inviteToken,
      hostId: getPersonalId(),
      hostName: this.selfName,
      hostAvatarId: this.selfAvatarId
    });
  }

  hasContactJoinedViaInvite(contactId: string): boolean {
    return this.joinedAutoInviteContactIds.has(contactId);
  }

  private inviteContacts(contacts: Contact[]): void {
    for (const contact of contacts) this.inviteContact(contact);
  }

  private handleInviteMessage(fromId: string, message: InviteMessage): void {
    window.api.getContacts().then((contacts) => {
      if (!contacts.some((contact) => contact.id === message.hostId)) return;
      this.dispatchEvent(
        new CustomEvent('invite-received', {
          detail: {
            fromId,
            roomCode: message.roomCode,
            roomPassword: message.roomPassword,
            inviteToken: message.inviteToken,
            hostName: message.hostName,
            hostAvatarId: normalizeAvatarId(message.hostAvatarId)
          }
        })
      );
    });
  }

  private applyKick(targetId: string): void {
    this.blockedIds.add(targetId);
    const member = this.registry.get(targetId);
    if (member?.conn) safeCall(member.conn, 'close');
    if (member?.mediaConnIn) safeCall(member.mediaConnIn, 'close');
    if (member?.voiceConnIn) safeCall(member.voiceConnIn, 'close');
    this.voice.removeMember(targetId);
    this.registry.remove(targetId);
    this.emitMembers();
  }

  private cleanupMember(id: string): void {
    const member = this.registry.get(id);
    if (member?.mediaConnIn) safeCall(member.mediaConnIn, 'close');
    if (member?.voiceConnIn) safeCall(member.voiceConnIn, 'close');
    if (member?.authenticated) {
      logEvent(LogCategory.ROOM, LogLevel.INFO, LOG_STRINGS.memberLeftMessage(member.name || id));
      this.dispatchEvent(new CustomEvent('member-left', { detail: { id, name: member.name || id } }));
    }
    this.media.removeViewer(id);
    this.voice.removeMember(id);
    this.registry.remove(id);
    this.auth.notifyMemberDisconnected(id);
    this.emitMembers();
  }

  async retryMicPermission(): Promise<void> {
    if (this.micActive || this.roomCode === null) return;
    await this.startVoiceChat();
  }

  pauseVoice(): void {
    this.stopVoiceChat();
  }

  async resumeVoice(): Promise<void> {
    if (this.micActive || this.roomCode === null) return;
    await this.startVoiceChat();
  }

  private async startVoiceChat(): Promise<void> {
    try {
      this.micCapture = await captureMicrophone(getMicInputDeviceId(), getMicInputGain(), getNoiseSuppressionEnabled());
    } catch (error) {
      console.warn('[room] não foi possível capturar o microfone', error);
      logEvent(LogCategory.VOICE, LogLevel.WARNING, LOG_STRINGS.micUnavailableMessage, (error as Error).message);
      this.dispatchEvent(new CustomEvent('mic-active-changed', { detail: { active: false } }));
      return;
    }
    this.micCapture.setMuted(this.voice.micMuted);
    this.voice.start(this.micCapture.stream);
    this.unsubscribeMicGain = subscribeToMicInputGain(() => this.micCapture?.setGain(getMicInputGain()));
    this.unsubscribeMicDevice = subscribeToMicInputDevice(() => this.recaptureMicrophone());
    this.unsubscribeNoiseSuppression = subscribeToNoiseSuppression(() => this.recaptureMicrophone());
    logEvent(LogCategory.VOICE, LogLevel.INFO, LOG_STRINGS.micActiveMessage);
    this.dispatchEvent(new CustomEvent('mic-active-changed', { detail: { active: true } }));
  }

  private async recaptureMicrophone(): Promise<void> {
    try {
      const nextCapture = await captureMicrophone(getMicInputDeviceId(), getMicInputGain(), getNoiseSuppressionEnabled());
      nextCapture.setMuted(this.voice.micMuted);
      this.micCapture = nextCapture;
      this.voice.replaceStream(nextCapture.stream);
    } catch (error) {
      console.warn('[room] não foi possível trocar de microfone', error);
      logEvent(LogCategory.VOICE, LogLevel.WARNING, LOG_STRINGS.micDeviceSwitchFailedMessage, (error as Error).message);
    }
  }

  private stopVoiceChat(): void {
    this.unsubscribeMicGain?.();
    this.unsubscribeMicGain = null;
    this.unsubscribeMicDevice?.();
    this.unsubscribeMicDevice = null;
    this.unsubscribeNoiseSuppression?.();
    this.unsubscribeNoiseSuppression = null;
    this.voice.stop();
    this.micCapture?.stop();
    this.micCapture = null;
    this.dispatchEvent(new CustomEvent('mic-active-changed', { detail: { active: false } }));
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
