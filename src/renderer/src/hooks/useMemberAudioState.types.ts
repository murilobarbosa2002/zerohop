export interface MemberAudioState {
  volume: number;
  muted: boolean;
}

export interface MemberAudioStateStore {
  get: (id: string) => MemberAudioState;
}
