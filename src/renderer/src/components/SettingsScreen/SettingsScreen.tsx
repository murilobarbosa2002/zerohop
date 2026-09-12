import { AudioOutputSettings } from '@/components/SettingsScreen/AudioOutputSettings';
import { MicInputSettings } from '@/components/SettingsScreen/MicInputSettings';
import { ExperimentalCaptureSettings } from '@/components/SettingsScreen/ExperimentalCaptureSettings';
import { ExperimentalPerAppAudioSettings } from '@/components/SettingsScreen/ExperimentalPerAppAudioSettings';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { SettingsScreenProps } from '@/components/SettingsScreen/SettingsScreen.types';

export function SettingsScreen({ onBack, roomClient }: SettingsScreenProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border flex-shrink-0">
        <button onClick={onBack} className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent">
          {SETTINGS_STRINGS.backButton}
        </button>
        <p className="font-bold text-body-sm-alt">{SETTINGS_STRINGS.screenTitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AudioOutputSettings />
        <MicInputSettings roomClient={roomClient} />
        <ExperimentalCaptureSettings />
        <ExperimentalPerAppAudioSettings />
      </div>
    </div>
  );
}
