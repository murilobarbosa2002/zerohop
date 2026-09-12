import { PARTICIPANTS_STRINGS } from '@/strings/participants.strings';

export function ParticipantVideoConnecting() {
  return <p className="text-text-dim text-xs py-2.5">{PARTICIPANTS_STRINGS.connectingMessage}</p>;
}
