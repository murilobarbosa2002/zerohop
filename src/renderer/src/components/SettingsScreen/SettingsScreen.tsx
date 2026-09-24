import { useState } from 'react';
import { AudioOutputSettings } from '@/components/SettingsScreen/AudioOutputSettings';
import { MicInputSettings } from '@/components/SettingsScreen/MicInputSettings';
import { SoundEffectsSettings } from '@/components/SettingsScreen/SoundEffectsSettings';
import { UiScaleSettings } from '@/components/SettingsScreen/UiScaleSettings';
import { HotkeySettings } from '@/components/SettingsScreen/HotkeySettings';
import { InviteSettings } from '@/components/SettingsScreen/InviteSettings';
import { PersonalRoomSettings } from '@/components/SettingsScreen/PersonalRoomSettings';
import { settingsCategoryTabVariants } from '@/components/SettingsScreen/SettingsScreen.variants';
import { playBackButtonSound, playSettingsCategoryClickSound } from '@/services/soundEffects';
import { SettingsCategory } from '@/constants/settingsCategory';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { SettingsScreenProps } from '@/components/SettingsScreen/SettingsScreen.types';

const CATEGORIES: { category: SettingsCategory; label: string }[] = [
  { category: SettingsCategory.AUDIO, label: SETTINGS_STRINGS.categoryAudioLabel },
  { category: SettingsCategory.SOUNDS, label: SETTINGS_STRINGS.categorySoundsLabel },
  { category: SettingsCategory.INTERFACE, label: SETTINGS_STRINGS.categoryInterfaceLabel },
  { category: SettingsCategory.HOTKEYS, label: SETTINGS_STRINGS.categoryHotkeysLabel },
  { category: SettingsCategory.CONTACTS, label: SETTINGS_STRINGS.categoryContactsLabel }
];

export function SettingsScreen({ onBack, roomClient, findSessionByRoomCode, initialCategory }: SettingsScreenProps) {
  const [category, setCategory] = useState<SettingsCategory>(initialCategory ?? SettingsCategory.AUDIO);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border flex-shrink-0">
        <button
          onClick={() => {
            playBackButtonSound();
            onBack();
          }}
          className="text-body-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent"
        >
          {SETTINGS_STRINGS.backButton}
        </button>
        <p className="font-bold text-body-sm-alt">{SETTINGS_STRINGS.screenTitle}</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-form-column flex-shrink-0 border-b md:border-b-0 md:border-r border-border overflow-y-auto py-2 px-2 flex flex-row flex-wrap md:flex-col gap-1">
          {CATEGORIES.map((item) => (
            <button
              key={item.category}
              className={settingsCategoryTabVariants({ active: category === item.category })}
              onClick={() => {
                playSettingsCategoryClickSound();
                setCategory(item.category);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {category === SettingsCategory.AUDIO && (
            <>
              <AudioOutputSettings />
              <MicInputSettings roomClient={roomClient} />
            </>
          )}
          {category === SettingsCategory.SOUNDS && <SoundEffectsSettings />}
          {category === SettingsCategory.INTERFACE && <UiScaleSettings />}
          {category === SettingsCategory.HOTKEYS && <HotkeySettings />}
          {category === SettingsCategory.CONTACTS && (
            <>
              <PersonalRoomSettings findSessionByRoomCode={findSessionByRoomCode} />
              <InviteSettings />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
