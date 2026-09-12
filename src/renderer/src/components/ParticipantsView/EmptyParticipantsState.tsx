import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';

export function EmptyParticipantsState() {
  return <p className="text-text-dim text-xs py-2.5">{PARTICIPANTS_STRINGS.emptyRoomMessage}</p>;
}
