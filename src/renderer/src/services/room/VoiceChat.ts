import type { MediaConnection, default as Peer } from 'peerjs';
import { sendTo, safeCall } from '@/services/room/peerSession';
import { CallKind } from '@/constants/callKind';
import { VOICE_CALL_CONNECT_TIMEOUT_MS, VOICE_CALL_RETRY_DELAY_MS, VOICE_CALL_MAX_RETRIES } from '@/constants/timing';
import { logEvent } from '@/services/appLog';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';
import type { MemberRegistry } from '@/services/room/MemberRegistry';
import type { MicStatusMessage } from '@/services/room/RoomProtocol';

function waitForCallPeerConnection(call: MediaConnection, maxAttempts = 25): Promise<RTCPeerConnection | null> {
  return new Promise((resolve) => {
    let attempts = 0;
    const poll = setInterval(() => {
      attempts++;
      if (call.peerConnection) {
        clearInterval(poll);
        resolve(call.peerConnection);
      } else if (attempts > maxAttempts) {
        clearInterval(poll);
        resolve(null);
      }
    }, 200);
  });
}

export class VoiceChat extends EventTarget {
  private registry: MemberRegistry;
  private getPeer: () => Peer | null;
  active = false;
  micMuted = false;
  private localStream: MediaStream | null = null;
  private outgoingCalls = new Map<string, MediaConnection>();

  constructor({ registry, getPeer }: { registry: MemberRegistry; getPeer: () => Peer | null }) {
    super();
    this.registry = registry;
    this.getPeer = getPeer;
  }

  start(stream: MediaStream): void {
    this.localStream = stream;
    this.active = true;
    const track = stream.getAudioTracks()[0];
    if (track) track.enabled = !this.micMuted;
    for (const id of this.registry.ids()) this.callMember(id);
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    for (const call of this.outgoingCalls.values()) safeCall(call, 'close');
    this.outgoingCalls.clear();
  }

  callMember(id: string, attempt = 0): void {
    const peer = this.getPeer();
    if (!this.active || !this.localStream || !peer || this.outgoingCalls.has(id)) return;
    const call = peer.call(id, this.localStream, { metadata: { kind: CallKind.VOICE } });
    this.outgoingCalls.set(id, call);
    call.on('close', () => this.outgoingCalls.delete(id));
    this.watchCallConnection(id, call, attempt);
  }

  private async watchCallConnection(id: string, call: MediaConnection, attempt: number): Promise<void> {
    const peerConnection = await waitForCallPeerConnection(call);
    if (!peerConnection) return;

    let settled = false;
    const onStateChange = (): void => {
      const state = peerConnection.iceConnectionState;
      if (state === 'connected' || state === 'completed') settled = true;
    };
    peerConnection.addEventListener('iceconnectionstatechange', onStateChange);

    setTimeout(() => {
      peerConnection.removeEventListener('iceconnectionstatechange', onStateChange);
      if (settled) return;
      if (this.outgoingCalls.get(id) !== call) return;
      safeCall(call, 'close');
      this.outgoingCalls.delete(id);
      if (attempt < VOICE_CALL_MAX_RETRIES) {
        logEvent(LogCategory.VOICE, LogLevel.WARNING, LOG_STRINGS.voiceCallRetryMessage(id));
        setTimeout(() => this.callMember(id, attempt + 1), VOICE_CALL_RETRY_DELAY_MS);
      } else {
        logEvent(LogCategory.VOICE, LogLevel.ERROR, LOG_STRINGS.voiceCallFailedMessage(id));
      }
    }, VOICE_CALL_CONNECT_TIMEOUT_MS);
  }

  setMicMuted(muted: boolean): void {
    this.micMuted = muted;
    const track = this.localStream?.getAudioTracks()[0];
    if (track) track.enabled = !muted;
    for (const member of this.registry.values()) sendTo(member.conn, { type: 'mic-status', muted } as MicStatusMessage);
    this.dispatchEvent(new CustomEvent('mic-muted-changed', { detail: { muted } }));
  }

  replaceStream(stream: MediaStream): void {
    if (this.localStream) this.localStream.getTracks().forEach((track) => track.stop());
    this.localStream = stream;
    const newTrack = stream.getAudioTracks()[0];
    if (newTrack) newTrack.enabled = !this.micMuted;
    for (const call of this.outgoingCalls.values()) {
      const sender = call.peerConnection?.getSenders().find((candidate) => candidate.track?.kind === 'audio');
      sender?.replaceTrack(newTrack ?? null).catch(() => {});
    }
  }

  removeMember(id: string): void {
    const call = this.outgoingCalls.get(id);
    if (!call) return;
    safeCall(call, 'close');
    this.outgoingCalls.delete(id);
  }
}
