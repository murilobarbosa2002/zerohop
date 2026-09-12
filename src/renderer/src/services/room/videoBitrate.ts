import { BITS_PER_PIXEL_PER_FRAME } from '@/constants/videoBitrate';
import type { QualitySettings } from '@/services/ScreenCapture';

export function suggestedBitrate(width: number, height: number, fps: number): number {
  const pixels = width * height;
  return Math.round(pixels * fps * BITS_PER_PIXEL_PER_FRAME);
}

export function boostVideoBitrate(peerConnection: RTCPeerConnection, { width, height, fps }: QualitySettings): void {
  const maxBitrate = suggestedBitrate(width, height, fps);
  peerConnection.getSenders().forEach((sender) => {
    if (!sender.track || sender.track.kind !== 'video') return;
    const params = sender.getParameters();
    if (!params.encodings || params.encodings.length === 0) params.encodings = [{}];
    params.encodings[0].maxBitrate = maxBitrate;
    params.encodings[0].maxFramerate = fps;
    sender.setParameters(params).catch(() => {});
  });
}
