import { VoiceAudioSink } from '@/components/Room/VoiceAudioSinks/VoiceAudioSink';
import type { VoiceAudioSinksProps } from '@/components/Room/VoiceAudioSinks/VoiceAudioSinks.types';

export function VoiceAudioSinks({ members, voiceAudioState, deafened }: VoiceAudioSinksProps) {
  return (
    <>
      {members
        .filter((member) => member.voiceStream)
        .map((member) => (
          <VoiceAudioSink key={member.id} member={member} voiceAudioState={voiceAudioState} deafened={deafened} />
        ))}
    </>
  );
}
