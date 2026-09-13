import dialUpInternetSound from '@/assets/sounds/dial-up-internet.mp3';
import icqUhOhSound from '@/assets/sounds/icq-uh-oh.mp3';

const JOINED_ROOM_SOUND_VOLUME = 0.3;

export function playJoinedRoomSound(): void {
  const audio = new Audio(dialUpInternetSound);
  audio.volume = JOINED_ROOM_SOUND_VOLUME;
  audio.play().catch(() => {});
}

export function playMemberJoinedSound(): void {
  new Audio(icqUhOhSound).play().catch(() => {});
}
