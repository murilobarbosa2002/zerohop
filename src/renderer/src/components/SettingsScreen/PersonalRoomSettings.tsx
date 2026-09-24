import { CopyButton } from '@/components/CopyButton';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { usePersonalRoom } from '@/hooks/usePersonalRoom';
import { playPersonalAutoOpenToggleSound } from '@/services/soundEffects';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { PersonalRoomSettingsProps } from '@/components/SettingsScreen/PersonalRoomSettings.types';

export function PersonalRoomSettings({ findSessionByRoomCode }: PersonalRoomSettingsProps) {
  const personalRoom = usePersonalRoom();

  function handleChangePassword(value: string): void {
    personalRoom.setPassword(value);
    findSessionByRoomCode(personalRoom.id)?.roomClient.setPassword(value);
  }

  return (
    <div className="max-w-modal">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.personalRoomSettingsTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.personalRoomSettingsHint}</p>

      <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0 mt-3">
        <span className="text-body-xs text-text-dim block mb-1">{SETTINGS_STRINGS.personalIdLabel}</span>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono font-bold tracking-wide text-accent truncate">{personalRoom.id}</span>
          <CopyButton text={personalRoom.id} />
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
        {SETTINGS_STRINGS.personalPasswordLabel}
        <PasswordInput
          value={personalRoom.password}
          onChange={(event) => handleChangePassword(event.target.value)}
          maxLength={ROOM_PASSWORD_MAX_LENGTH}
          placeholder={SETTINGS_STRINGS.personalPasswordPlaceholder}
          soundKind={TextInputSoundKind.PASSWORD}
        />
      </label>
      <p className="text-warn text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.personalPasswordRequiredHint}</p>

      <label className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2 mt-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-accent flex-shrink-0"
          checked={personalRoom.autoOpenEnabled}
          onChange={(event) => {
            playPersonalAutoOpenToggleSound();
            personalRoom.setAutoOpenEnabled(event.target.checked);
          }}
        />
        <span className="font-bold text-body-sm">{SETTINGS_STRINGS.personalAutoOpenLabel}</span>
      </label>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.personalAutoOpenHint}</p>
    </div>
  );
}
