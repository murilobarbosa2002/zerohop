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
    minWidth: width,
    maxWidth: width,
    minHeight: height,
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
  const stream = await navigator.mediaDevices.getUserMedia(captureConstraints(videoSourceId, audioSourceId, quality));
  const videoTrack = stream.getVideoTracks()[0];
  if (videoTrack) videoTrack.contentHint = 'detail';
  return stream;
}
