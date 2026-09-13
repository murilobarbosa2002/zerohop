import dialUpInternetSound from '@/assets/sounds/dial-up-internet.mp3';
import icqUhOhSound from '@/assets/sounds/icq-uh-oh.mp3';
import keyClickSound from '@/assets/sounds/key-click.wav';
import messageSentSound from '@/assets/sounds/message-sent.wav';
import { getSoundEffectsVolume } from '@/services/soundEffectsPreference';

const KEY_CLICK_VOLUME_MULTIPLIER = 0.6;

function play(source: string, volume: number): void {
  const audio = new Audio(source);
  audio.volume = Math.min(1, Math.max(0, volume));
  audio.play().catch(() => {});
}

export function playJoinedRoomSound(): void {
  play(dialUpInternetSound, getSoundEffectsVolume());
}

export function playMemberJoinedSound(): void {
  play(icqUhOhSound, getSoundEffectsVolume());
}

export function playKeyClickSound(): void {
  play(keyClickSound, getSoundEffectsVolume() * KEY_CLICK_VOLUME_MULTIPLIER);
}

export function playMessageSentSound(): void {
  play(messageSentSound, getSoundEffectsVolume());
}
