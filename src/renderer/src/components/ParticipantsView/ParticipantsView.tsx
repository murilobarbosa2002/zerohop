import { EmptyParticipantsState } from '@/components/ParticipantsView/EmptyParticipantsState';
import { ParticipantsGrid } from '@/components/ParticipantsView/ParticipantsGrid';
import type { ParticipantsViewProps } from '@/components/ParticipantsView/ParticipantsView.types';

export function ParticipantsView({ members, onToggleWatch, canKick, onKick, voiceAudioState }: ParticipantsViewProps) {
  return members.length === 0 ? (
    <EmptyParticipantsState />
  ) : (
    <ParticipantsGrid members={members} onToggleWatch={onToggleWatch} canKick={canKick} onKick={onKick} voiceAudioState={voiceAudioState} />
  );
}
