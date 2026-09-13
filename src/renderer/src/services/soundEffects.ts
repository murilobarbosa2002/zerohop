import dialUpInternetSound from '@/assets/sounds/dial-up-internet.mp3';
import icqUhOhSound from '@/assets/sounds/icq-uh-oh.mp3';
import keyClickSound from '@/assets/sounds/key-click.wav';
import messageSentSound from '@/assets/sounds/message-sent.wav';
import messageReceivedSound from '@/assets/sounds/message-received.wav';
import screenOpenSound from '@/assets/sounds/screen-open.wav';
import screenCloseSound from '@/assets/sounds/screen-close.wav';
import micMuteSound from '@/assets/sounds/mic-mute.wav';
import micUnmuteSound from '@/assets/sounds/mic-unmute.wav';
import deafenSound from '@/assets/sounds/deafen.wav';
import undeafenSound from '@/assets/sounds/undeafen.wav';
import shareStartSound from '@/assets/sounds/share-start.wav';
import shareStopSound from '@/assets/sounds/share-stop.wav';
import errorSound from '@/assets/sounds/error.wav';
import copyClickSound from '@/assets/sounds/copy-click.wav';
import kickSound from '@/assets/sounds/kick.wav';
import joinApprovedSound from '@/assets/sounds/join-approved.wav';
import joinDeniedSound from '@/assets/sounds/join-denied.wav';
import sidebarShowSound from '@/assets/sounds/sidebar-show.wav';
import sidebarHideSound from '@/assets/sounds/sidebar-hide.wav';
import chatShowSound from '@/assets/sounds/chat-show.wav';
import chatHideSound from '@/assets/sounds/chat-hide.wav';
import avatarSelectSound from '@/assets/sounds/avatar-select.wav';
import messageDeleteSound from '@/assets/sounds/message-delete.wav';
import messageDeletedRemoteSound from '@/assets/sounds/message-deleted-remote.wav';
import createRoomClickSound from '@/assets/sounds/create-room-click.wav';
import joinRoomClickSound from '@/assets/sounds/join-room-click.wav';
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

export function playMessageReceivedSound(): void {
  play(messageReceivedSound, getSoundEffectsVolume());
}

export function playScreenOpenSound(): void {
  play(screenOpenSound, getSoundEffectsVolume());
}

export function playScreenCloseSound(): void {
  play(screenCloseSound, getSoundEffectsVolume());
}

export function playMicMuteSound(): void {
  play(micMuteSound, getSoundEffectsVolume());
}

export function playMicUnmuteSound(): void {
  play(micUnmuteSound, getSoundEffectsVolume());
}

export function playDeafenSound(): void {
  play(deafenSound, getSoundEffectsVolume());
}

export function playUndeafenSound(): void {
  play(undeafenSound, getSoundEffectsVolume());
}

export function playShareStartSound(): void {
  play(shareStartSound, getSoundEffectsVolume());
}

export function playShareStopSound(): void {
  play(shareStopSound, getSoundEffectsVolume());
}

export function playErrorSound(): void {
  play(errorSound, getSoundEffectsVolume());
}

export function playCopyClickSound(): void {
  play(copyClickSound, getSoundEffectsVolume());
}

export function playKickSound(): void {
  play(kickSound, getSoundEffectsVolume());
}

export function playJoinApprovedSound(): void {
  play(joinApprovedSound, getSoundEffectsVolume());
}

export function playJoinDeniedSound(): void {
  play(joinDeniedSound, getSoundEffectsVolume());
}

export function playSidebarShowSound(): void {
  play(sidebarShowSound, getSoundEffectsVolume());
}

export function playSidebarHideSound(): void {
  play(sidebarHideSound, getSoundEffectsVolume());
}

export function playChatShowSound(): void {
  play(chatShowSound, getSoundEffectsVolume());
}

export function playChatHideSound(): void {
  play(chatHideSound, getSoundEffectsVolume());
}

export function playAvatarSelectSound(): void {
  play(avatarSelectSound, getSoundEffectsVolume());
}

export function playMessageDeleteSound(): void {
  play(messageDeleteSound, getSoundEffectsVolume());
}

export function playMessageDeletedRemoteSound(): void {
  play(messageDeletedRemoteSound, getSoundEffectsVolume());
}

export function playCreateRoomClickSound(): void {
  play(createRoomClickSound, getSoundEffectsVolume());
}

export function playJoinRoomClickSound(): void {
  play(joinRoomClickSound, getSoundEffectsVolume());
}
