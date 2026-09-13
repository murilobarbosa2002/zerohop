import dialUpInternetSound from '@/assets/sounds/dial-up-internet.mp3';
import icqUhOhSound from '@/assets/sounds/icq-uh-oh.mp3';
import { getSoundEffectsVolume } from '@/services/soundEffectsPreference';

export function playJoinedRoomSound(): void {
  const audio = new Audio(dialUpInternetSound);
  audio.volume = getSoundEffectsVolume();
  audio.play().catch(() => {});
}

export function playMemberJoinedSound(): void {
  const audio = new Audio(icqUhOhSound);
  audio.volume = getSoundEffectsVolume();
  audio.play().catch(() => {});
}
