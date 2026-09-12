export enum Resolution {
  HD = '1280x720',
  FULL_HD = '1920x1080',
  QUAD_HD = '2560x1440',
  ULTRA_HD = '3840x2160'
}

export const RESOLUTION_LABELS: Record<Resolution, string> = {
  [Resolution.HD]: '720p',
  [Resolution.FULL_HD]: '1080p',
  [Resolution.QUAD_HD]: '1440p',
  [Resolution.ULTRA_HD]: '4K'
};

export const DEFAULT_RESOLUTION = Resolution.FULL_HD;
export const MIN_CAPTURE_WIDTH = 320;
export const MIN_CAPTURE_HEIGHT = 240;
