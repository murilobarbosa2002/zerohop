import dialUpInternetSound from '@/assets/sounds/dial-up-internet.mp3';
import icqUhOhSound from '@/assets/sounds/icq-uh-oh.mp3';
import keyClickSound from '@/assets/sounds/key-click.wav';
import messageSentSound from '@/assets/sounds/message-sent.wav';
import messageReceivedSound from '@/assets/sounds/message-received.wav';
import screenOpenSound from '@/assets/sounds/screen-open.wav';
import screenCloseSound from '@/assets/sounds/screen-close.wav';
import micMuteSound from '@/assets/sounds/mic-mute.wav';
import micUnmuteSound from '@/assets/sounds/mic-unmute.wav';
import pushToTalkStartSound from '@/assets/sounds/push-to-talk-start.wav';
import pushToTalkStopSound from '@/assets/sounds/push-to-talk-stop.wav';
import openContactsClickSound from '@/assets/sounds/open-contacts-click.wav';
import callContactClickSound from '@/assets/sounds/call-contact-click.wav';
import addContactClickSound from '@/assets/sounds/add-contact-click.wav';
import removeContactClickSound from '@/assets/sounds/remove-contact-click.wav';
import openPersonalRoomClickSound from '@/assets/sounds/open-personal-room-click.wav';
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
import logsClearOpenSound from '@/assets/sounds/logs-clear-open.wav';
import logsClearCancelSound from '@/assets/sounds/logs-clear-cancel.wav';
import logsClearConfirmSound from '@/assets/sounds/logs-clear-confirm.wav';
import tabStatusSound from '@/assets/sounds/tab-status.wav';
import tabChangelogSound from '@/assets/sounds/tab-changelog.wav';
import tabVersionsSound from '@/assets/sounds/tab-versions.wav';
import joinRequestSound from '@/assets/sounds/join-request.wav';
import memberLeftSound from '@/assets/sounds/member-left.wav';
import roomLeftSound from '@/assets/sounds/room-left.wav';
import inputNameFocusSound from '@/assets/sounds/input-name-focus.wav';
import inputNameTypeSound from '@/assets/sounds/input-name-type.wav';
import inputPasswordFocusSound from '@/assets/sounds/input-password-focus.wav';
import inputPasswordTypeSound from '@/assets/sounds/input-password-type.wav';
import inputRoomCodeFocusSound from '@/assets/sounds/input-roomcode-focus.wav';
import inputRoomCodeTypeSound from '@/assets/sounds/input-roomcode-type.wav';
import inputChatFocusSound from '@/assets/sounds/input-chat-focus.wav';
import backButtonSound from '@/assets/sounds/back-button.wav';
import openLogsSound from '@/assets/sounds/open-logs.wav';
import openSettingsSound from '@/assets/sounds/open-settings.wav';
import shareOpenPickerSound from '@/assets/sounds/share-open-picker.wav';
import shareKindFullscreenSound from '@/assets/sounds/share-kind-fullscreen.wav';
import shareKindWindowSound from '@/assets/sounds/share-kind-window.wav';
import shareCancelSound from '@/assets/sounds/share-cancel.wav';
import shareSourceSelectSound from '@/assets/sounds/share-source-select.wav';
import shareResolutionChangeSound from '@/assets/sounds/share-resolution-change.wav';
import shareFpsChangeSound from '@/assets/sounds/share-fps-change.wav';
import shareAudioChangeSound from '@/assets/sounds/share-audio-change.wav';
import shareEditSound from '@/assets/sounds/share-edit.wav';
import shareSaveChangesSound from '@/assets/sounds/share-save-changes.wav';
import appOpenSound from '@/assets/sounds/app-open.wav';
import appCloseSound from '@/assets/sounds/app-close.wav';
import updateCheckSound from '@/assets/sounds/update-check.wav';
import updateFoundSound from '@/assets/sounds/update-found.wav';
import updateDownloadedSound from '@/assets/sounds/update-downloaded.wav';
import updateInstallSound from '@/assets/sounds/update-install.wav';
import updateLaterSound from '@/assets/sounds/update-later.wav';
import { getSoundEffectsVolume } from '@/services/soundEffectsPreference';
import { SoundCategory } from '@/constants/soundEffects';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';

const KEY_CLICK_VOLUME_MULTIPLIER = 0.6;

function play(source: string, category: SoundCategory, multiplier = 1): void {
  const audio = new Audio(source);
  audio.volume = Math.min(1, Math.max(0, getSoundEffectsVolume(category) * multiplier));
  audio.play().catch(() => {});
}

export function playJoinedRoomSound(): void {
  play(dialUpInternetSound, SoundCategory.ROOM);
}

export function playMemberJoinedSound(): void {
  play(icqUhOhSound, SoundCategory.ROOM);
}

export function playKeyClickSound(): void {
  play(keyClickSound, SoundCategory.CHAT, KEY_CLICK_VOLUME_MULTIPLIER);
}

export function playMessageSentSound(): void {
  play(messageSentSound, SoundCategory.CHAT);
}

export function playMessageReceivedSound(): void {
  play(messageReceivedSound, SoundCategory.CHAT);
}

export function playScreenOpenSound(): void {
  play(screenOpenSound, SoundCategory.INTERFACE);
}

export function playScreenCloseSound(): void {
  play(screenCloseSound, SoundCategory.INTERFACE);
}

export function playMicMuteSound(): void {
  play(micMuteSound, SoundCategory.VOICE);
}

export function playMicUnmuteSound(): void {
  play(micUnmuteSound, SoundCategory.VOICE);
}

export function playPushToTalkStartSound(): void {
  play(pushToTalkStartSound, SoundCategory.VOICE);
}

export function playPushToTalkStopSound(): void {
  play(pushToTalkStopSound, SoundCategory.VOICE);
}

export function playDeafenSound(): void {
  play(deafenSound, SoundCategory.VOICE);
}

export function playUndeafenSound(): void {
  play(undeafenSound, SoundCategory.VOICE);
}

export function playShareStartSound(): void {
  play(shareStartSound, SoundCategory.SHARING);
}

export function playShareStopSound(): void {
  play(shareStopSound, SoundCategory.SHARING);
}

export function playErrorSound(): void {
  play(errorSound, SoundCategory.INTERFACE);
}

export function playCopyClickSound(): void {
  play(copyClickSound, SoundCategory.INTERFACE);
}

export function playKickSound(): void {
  play(kickSound, SoundCategory.ROOM);
}

export function playJoinApprovedSound(): void {
  play(joinApprovedSound, SoundCategory.ROOM);
}

export function playJoinDeniedSound(): void {
  play(joinDeniedSound, SoundCategory.ROOM);
}

export function playSidebarShowSound(): void {
  play(sidebarShowSound, SoundCategory.INTERFACE);
}

export function playSidebarHideSound(): void {
  play(sidebarHideSound, SoundCategory.INTERFACE);
}

export function playChatShowSound(): void {
  play(chatShowSound, SoundCategory.INTERFACE);
}

export function playChatHideSound(): void {
  play(chatHideSound, SoundCategory.INTERFACE);
}

export function playAvatarSelectSound(): void {
  play(avatarSelectSound, SoundCategory.INTERFACE);
}

export function playMessageDeleteSound(): void {
  play(messageDeleteSound, SoundCategory.CHAT);
}

export function playMessageDeletedRemoteSound(): void {
  play(messageDeletedRemoteSound, SoundCategory.CHAT);
}

export function playCreateRoomClickSound(): void {
  play(createRoomClickSound, SoundCategory.ROOM);
}

export function playJoinRoomClickSound(): void {
  play(joinRoomClickSound, SoundCategory.ROOM);
}

export function playOpenContactsClickSound(): void {
  play(openContactsClickSound, SoundCategory.ROOM);
}

export function playCallContactClickSound(): void {
  play(callContactClickSound, SoundCategory.ROOM);
}

export function playAddContactClickSound(): void {
  play(addContactClickSound, SoundCategory.ROOM);
}

export function playRemoveContactClickSound(): void {
  play(removeContactClickSound, SoundCategory.ROOM);
}

export function playOpenPersonalRoomClickSound(): void {
  play(openPersonalRoomClickSound, SoundCategory.ROOM);
}

export function playLogsClearOpenSound(): void {
  play(logsClearOpenSound, SoundCategory.INTERFACE);
}

export function playLogsClearCancelSound(): void {
  play(logsClearCancelSound, SoundCategory.INTERFACE);
}

export function playLogsClearConfirmSound(): void {
  play(logsClearConfirmSound, SoundCategory.INTERFACE);
}

export function playTabStatusSound(): void {
  play(tabStatusSound, SoundCategory.INTERFACE);
}

export function playTabChangelogSound(): void {
  play(tabChangelogSound, SoundCategory.INTERFACE);
}

export function playTabVersionsSound(): void {
  play(tabVersionsSound, SoundCategory.INTERFACE);
}

export function playJoinRequestSound(): void {
  play(joinRequestSound, SoundCategory.ROOM);
}

export function playMemberLeftSound(): void {
  play(memberLeftSound, SoundCategory.ROOM);
}

export function playRoomLeftSound(): void {
  play(roomLeftSound, SoundCategory.ROOM);
}

export function playNameInputFocusSound(): void {
  play(inputNameFocusSound, SoundCategory.INTERFACE);
}

export function playNameInputTypeSound(): void {
  play(inputNameTypeSound, SoundCategory.INTERFACE, KEY_CLICK_VOLUME_MULTIPLIER);
}

export function playPasswordInputFocusSound(): void {
  play(inputPasswordFocusSound, SoundCategory.INTERFACE);
}

export function playPasswordInputTypeSound(): void {
  play(inputPasswordTypeSound, SoundCategory.INTERFACE, KEY_CLICK_VOLUME_MULTIPLIER);
}

export function playRoomCodeInputFocusSound(): void {
  play(inputRoomCodeFocusSound, SoundCategory.INTERFACE);
}

export function playRoomCodeInputTypeSound(): void {
  play(inputRoomCodeTypeSound, SoundCategory.INTERFACE, KEY_CLICK_VOLUME_MULTIPLIER);
}

export function playChatInputFocusSound(): void {
  play(inputChatFocusSound, SoundCategory.CHAT);
}

export function playBackButtonSound(): void {
  play(backButtonSound, SoundCategory.INTERFACE);
}

export function playOpenLogsSound(): void {
  play(openLogsSound, SoundCategory.INTERFACE);
}

export function playOpenSettingsSound(): void {
  play(openSettingsSound, SoundCategory.INTERFACE);
}

export function playShareOpenPickerSound(): void {
  play(shareOpenPickerSound, SoundCategory.SHARING);
}

export function playShareKindFullscreenSound(): void {
  play(shareKindFullscreenSound, SoundCategory.SHARING);
}

export function playShareKindWindowSound(): void {
  play(shareKindWindowSound, SoundCategory.SHARING);
}

export function playShareCancelSound(): void {
  play(shareCancelSound, SoundCategory.SHARING);
}

export function playShareSourceSelectSound(): void {
  play(shareSourceSelectSound, SoundCategory.SHARING);
}

export function playShareResolutionChangeSound(): void {
  play(shareResolutionChangeSound, SoundCategory.SHARING);
}

export function playShareFpsChangeSound(): void {
  play(shareFpsChangeSound, SoundCategory.SHARING);
}

export function playShareAudioChangeSound(): void {
  play(shareAudioChangeSound, SoundCategory.SHARING);
}

export function playShareEditSound(): void {
  play(shareEditSound, SoundCategory.SHARING);
}

export function playShareSaveChangesSound(): void {
  play(shareSaveChangesSound, SoundCategory.SHARING);
}

export function playAppOpenSound(): void {
  play(appOpenSound, SoundCategory.INTERFACE);
}

export function playAppCloseSound(): void {
  play(appCloseSound, SoundCategory.INTERFACE);
}

export function playUpdateCheckSound(): void {
  play(updateCheckSound, SoundCategory.INTERFACE);
}

export function playUpdateFoundSound(): void {
  play(updateFoundSound, SoundCategory.INTERFACE);
}

export function playUpdateDownloadedSound(): void {
  play(updateDownloadedSound, SoundCategory.INTERFACE);
}

export function playUpdateInstallSound(): void {
  play(updateInstallSound, SoundCategory.INTERFACE);
}

export function playUpdateLaterSound(): void {
  play(updateLaterSound, SoundCategory.INTERFACE);
}

export const TEXT_INPUT_SOUNDS: Record<TextInputSoundKind, { focus: () => void; type: () => void }> = {
  [TextInputSoundKind.NAME]: { focus: playNameInputFocusSound, type: playNameInputTypeSound },
  [TextInputSoundKind.PASSWORD]: { focus: playPasswordInputFocusSound, type: playPasswordInputTypeSound },
  [TextInputSoundKind.ROOM_CODE]: { focus: playRoomCodeInputFocusSound, type: playRoomCodeInputTypeSound },
  [TextInputSoundKind.CHAT]: { focus: playChatInputFocusSound, type: playKeyClickSound }
};
