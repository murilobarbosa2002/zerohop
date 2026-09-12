import { SelectField } from '@/components/SelectField';
import { useAudioOutputDevice } from '@/hooks/useAudioOutputDevice';
import { useAudioOutputDevices } from '@/hooks/useAudioOutputDevices';
import { SYSTEM_DEFAULT_AUDIO_OUTPUT_ID } from '@/constants/audioOutput';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';

export function AudioOutputSettings() {
  const [deviceId, setDeviceId] = useAudioOutputDevice();
  const devices = useAudioOutputDevices();
  const options = [
    { value: SYSTEM_DEFAULT_AUDIO_OUTPUT_ID, label: SETTINGS_STRINGS.systemDefaultAudioOutputOption },
    ...devices.map((device) => ({ value: device.deviceId, label: device.label }))
  ];

  return (
    <div className="max-w-modal">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.audioOutputTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.audioOutputHint}</p>
      <div className="mt-5">
        <SelectField label={SETTINGS_STRINGS.audioOutputFieldLabel} value={deviceId} onChange={setDeviceId} options={options} wide />
      </div>
    </div>
  );
}
