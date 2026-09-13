export interface MemberAudioState {
  volume: number;
  muted: boolean;
}

export interface MemberAudioStateStore {
  get: (id: string) => MemberAudioState;
  notifyChange: (id: string) => void;
  subscribe: (id: string, listener: () => void) => () => void;
}
