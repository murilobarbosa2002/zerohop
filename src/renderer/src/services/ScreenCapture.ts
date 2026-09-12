import { MIN_CAPTURE_WIDTH, MIN_CAPTURE_HEIGHT } from '@/constants/resolution';

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
    minWidth: MIN_CAPTURE_WIDTH,
    maxWidth: width,
    minHeight: MIN_CAPTURE_HEIGHT,
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
