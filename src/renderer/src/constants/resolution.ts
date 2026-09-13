export enum Resolution {
  HD = '1280x720',
  FULL_HD = '1920x1080'
}

export const RESOLUTION_LABELS: Record<Resolution, string> = {
  [Resolution.HD]: '720p',
  [Resolution.FULL_HD]: '1080p'
};

export const DEFAULT_RESOLUTION = Resolution.FULL_HD;
