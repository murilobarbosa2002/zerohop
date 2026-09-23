import { usePersonalRoom } from '@/hooks/usePersonalRoom';
import { playPersonalAutoOpenToggleSound } from '@/services/soundEffects';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';

export function PersonalRoomSettings() {
  const personalRoom = usePersonalRoom();

  return (
    <div className="max-w-modal">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.personalRoomSettingsTitle}</p>
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
