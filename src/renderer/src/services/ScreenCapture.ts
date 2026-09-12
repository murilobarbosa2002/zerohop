import { createLoopbackAudioTrack } from '@/services/audioLoopbackStream';

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

export async function captureSourceWithProcessAudio(
  videoSourceId: string,
  audioWindowTitle: string,
  quality: QualitySettings
): Promise<MediaStream> {
  const videoOnlyStream = await navigator.mediaDevices.getUserMedia(captureConstraints(videoSourceId, null, quality));
  const videoTrack = videoOnlyStream.getVideoTracks()[0];
  if (videoTrack) videoTrack.contentHint = 'detail';

  const processId = await window.api.findAudioProcessId(audioWindowTitle);
  if (processId === null) return videoOnlyStream;

  const { track: audioTrack, pushChunk } = createLoopbackAudioTrack();
  const unsubscribe = window.api.onAudioLoopbackChunk(pushChunk);
  window.api.startAudioLoopback(processId);

  const originalStop = audioTrack.stop.bind(audioTrack);
  audioTrack.stop = () => {
    originalStop();
    unsubscribe();
    window.api.stopAudioLoopback();
  };

  return new MediaStream([videoTrack, audioTrack]);
}
