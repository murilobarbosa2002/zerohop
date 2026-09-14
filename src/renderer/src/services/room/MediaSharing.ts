import type { MediaConnection, default as Peer } from 'peerjs';
import { sendTo, safeCall } from '@/services/room/peerSession';
import { CallKind } from '@/constants/callKind';
import { boostVideoBitrate } from '@/services/room/videoBitrate';
import type { MemberRegistry } from '@/services/room/MemberRegistry';
import type { QualitySettings } from '@/services/ScreenCapture';

export interface OutgoingCallDetail {
  peerId: string;
  call: MediaConnection;
  quality: QualitySettings | null;
}

export class MediaSharing extends EventTarget {
  private registry: MemberRegistry;
  private getPeer: () => Peer | null;
  sharing = false;
  localStream: MediaStream | null = null;
  quality: QualitySettings | null = null;
  private outgoingCalls = new Map<string, MediaConnection>();

  constructor({ registry, getPeer }: { registry: MemberRegistry; getPeer: () => Peer | null }) {
    super();
    this.registry = registry;
    this.getPeer = getPeer;
  }

  start(stream: MediaStream, quality: QualitySettings): void {
    this.localStream = stream;
    this.quality = quality;
    this.sharing = true;
    stream.getVideoTracks()[0]?.addEventListener('ended', () => this.stop());
    for (const member of this.registry.values()) sendTo(member.conn, { type: 'sharing-status', sharing: true });
    this.dispatchEvent(new CustomEvent('sharing-changed', { detail: { sharing: true } }));
  }

  replaceStream(stream: MediaStream, quality: QualitySettings): void {
    if (!this.sharing) return;
    const oldStream = this.localStream;
    this.localStream = stream;
    this.quality = quality;
    stream.getVideoTracks()[0]?.addEventListener('ended', () => this.stop());

    const newVideoTrack = stream.getVideoTracks()[0] ?? null;
    const newAudioTrack = stream.getAudioTracks()[0] ?? null;
    for (const call of this.outgoingCalls.values()) {
      const senders = call.peerConnection?.getSenders() ?? [];
      const videoSender = senders.find((sender) => sender.track?.kind === 'video');
      videoSender?.replaceTrack(newVideoTrack).catch(() => {});
      const audioSender = senders.find((sender) => sender.track?.kind === 'audio');
      if (newAudioTrack) audioSender?.replaceTrack(newAudioTrack).catch(() => {});
      if (call.peerConnection) boostVideoBitrate(call.peerConnection, quality);
    }

    oldStream?.getTracks().forEach((track) => track.stop());
  }

  stop(): void {
    if (!this.sharing) return;
    this.sharing = false;
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    for (const call of this.outgoingCalls.values()) safeCall(call, 'close');
    this.outgoingCalls.clear();
    for (const member of this.registry.values()) sendTo(member.conn, { type: 'sharing-status', sharing: false });
    this.dispatchEvent(new CustomEvent('sharing-changed', { detail: { sharing: false } }));
  }

  handleWatchRequest(fromId: string): void {
    const peer = this.getPeer();
    if (!this.sharing || !this.localStream || !peer) return;
    const call = peer.call(fromId, this.localStream, { metadata: { kind: CallKind.SHARE } });
    this.outgoingCalls.set(fromId, call);
    call.on('close', () => this.outgoingCalls.delete(fromId));
    this.dispatchEvent(new CustomEvent('outgoing-call', { detail: { peerId: fromId, call, quality: this.quality } }));
  }

  handleUnwatchRequest(fromId: string): void {
    this.removeViewer(fromId);
  }

  removeViewer(id: string): void {
    const call = this.outgoingCalls.get(id);
    if (!call) return;
    safeCall(call, 'close');
    this.outgoingCalls.delete(id);
  }
}
