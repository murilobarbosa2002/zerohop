import type { MediaConnection, default as Peer } from 'peerjs';
import { sendTo, safeCall } from '@/services/room/peerSession';
import { CallKind } from '@/constants/callKind';
import type { MemberRegistry } from '@/services/room/MemberRegistry';
import type { MicStatusMessage } from '@/services/room/RoomProtocol';

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
    this.micMuted = false;
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

  callMember(id: string): void {
    const peer = this.getPeer();
    if (!this.active || !this.localStream || !peer || this.outgoingCalls.has(id)) return;
    const call = peer.call(id, this.localStream, { metadata: { kind: CallKind.VOICE } });
    this.outgoingCalls.set(id, call);
    call.on('close', () => this.outgoingCalls.delete(id));
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
