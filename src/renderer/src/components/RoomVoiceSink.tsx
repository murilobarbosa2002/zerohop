import { VoiceAudioSinks } from '@/components/Room/VoiceAudioSinks';
import { useMembers } from '@/hooks/useMembers';
import { useDeafened } from '@/hooks/useDeafened';
import type { RoomVoiceSinkProps } from '@/components/RoomVoiceSink.types';

export function RoomVoiceSink({ roomClient, voiceAudioState }: RoomVoiceSinkProps) {
  const members = useMembers(roomClient);
  const deafened = useDeafened(roomClient);
  return <VoiceAudioSinks members={members} voiceAudioState={voiceAudioState} deafened={deafened} />;
}
