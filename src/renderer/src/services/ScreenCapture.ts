export interface QualitySettings {
  width: number;
  height: number;
  fps: number;
}

interface DesktopMandatoryConstraint {
  chromeMediaSource: 'desktop';
  chromeMediaSourceId: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  maxFrameRate?: number;
}

export function captureConstraints(
  videoSourceId: string,
  audioSourceId: string | null,
  { width, height, fps }: QualitySettings
): MediaStreamConstraints {
  const videoMandatory: DesktopMandatoryConstraint = {
    chromeMediaSource: 'desktop',
    chromeMediaSourceId: videoSourceId,
    minWidth: 320,
    maxWidth: width,
    minHeight: 240,
    maxHeight: height,
    maxFrameRate: fps
  };

  const audioMandatory: DesktopMandatoryConstraint | undefined = audioSourceId
    ? { chromeMediaSource: 'desktop', chromeMediaSourceId: audioSourceId }
    : undefined;

  return {
    audio: audioMandatory ? ({ mandatory: audioMandatory } as unknown as MediaTrackConstraints) : false,
    video: { mandatory: videoMandatory } as unknown as MediaTrackConstraints
  };
}

export async function captureSource(
  videoSourceId: string,
  audioSourceId: string | null,
  quality: QualitySettings
): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia(captureConstraints(videoSourceId, audioSourceId, quality));
}

export function suggestedBitrate(width: number, height: number, fps: number): number {
  const pixels = width * height;
  const bitsPerPixelPerFrame = 0.08;
  return Math.round(pixels * fps * bitsPerPixelPerFrame);
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
