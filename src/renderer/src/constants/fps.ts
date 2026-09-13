export enum Fps {
  THIRTY = '30',
  SIXTY = '60'
}

export const FPS_LABELS: Record<Fps, string> = {
  [Fps.THIRTY]: '30 fps',
  [Fps.SIXTY]: '60 fps'
};

export const DEFAULT_FPS = Fps.SIXTY;
