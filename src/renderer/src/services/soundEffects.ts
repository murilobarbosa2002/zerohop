import dialUpInternetSound from '@/assets/sounds/dial-up-internet.mp3';
import icqUhOhSound from '@/assets/sounds/icq-uh-oh.mp3';

export function playJoinedRoomSound(): void {
  new Audio(dialUpInternetSound).play().catch(() => {});
}

export function playMemberJoinedSound(): void {
  new Audio(icqUhOhSound).play().catch(() => {});
}
