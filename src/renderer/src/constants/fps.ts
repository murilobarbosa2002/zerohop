export enum Fps {
  THIRTY = '30',
  SIXTY = '60',
  ONE_TWENTY = '120'
}

export const FPS_LABELS: Record<Fps, string> = {
  [Fps.THIRTY]: '30 fps',
  [Fps.SIXTY]: '60 fps',
  [Fps.ONE_TWENTY]: '120 fps'
};

export const DEFAULT_FPS = Fps.SIXTY;
