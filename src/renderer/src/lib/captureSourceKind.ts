import { CaptureSourceKind, WINDOW_SOURCE_ID_PREFIX } from '@/constants/captureSourceKind';

export function getCaptureSourceKind(sourceId: string): CaptureSourceKind {
  return sourceId.startsWith(WINDOW_SOURCE_ID_PREFIX) ? CaptureSourceKind.WINDOW : CaptureSourceKind.SCREEN;
}
