import { AudioOutputSettings } from '@/components/SettingsScreen/AudioOutputSettings';
import { MicInputSettings } from '@/components/SettingsScreen/MicInputSettings';
import { SoundEffectsSettings } from '@/components/SettingsScreen/SoundEffectsSettings';
import { UiScaleSettings } from '@/components/SettingsScreen/UiScaleSettings';
import { HotkeySettings } from '@/components/SettingsScreen/HotkeySettings';
import { InviteSettings } from '@/components/SettingsScreen/InviteSettings';
import { playBackButtonSound } from '@/services/soundEffects';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { SettingsScreenProps } from '@/components/SettingsScreen/SettingsScreen.types';

export function SettingsScreen({ onBack, roomClient }: SettingsScreenProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border flex-shrink-0">
        <button
          onClick={() => {
            playBackButtonSound();
            onBack();
          }}
          className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent"
        >
          {SETTINGS_STRINGS.backButton}
        </button>
        <p className="font-bold text-body-sm-alt">{SETTINGS_STRINGS.screenTitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AudioOutputSettings />
        <MicInputSettings roomClient={roomClient} />
        <SoundEffectsSettings />
        <UiScaleSettings />
        <HotkeySettings />
        <InviteSettings />
      </div>
    </div>
  );
}
