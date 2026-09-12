import { SelectField } from '@/components/SelectField';
import { RangeSlider } from '@/components/RangeSlider';
import { useMicInputDevice } from '@/hooks/useMicInputDevice';
import { useMicInputDevices } from '@/hooks/useMicInputDevices';
import { useMicInputGain } from '@/hooks/useMicInputGain';
import { SYSTEM_DEFAULT_MIC_INPUT_ID, MIN_MIC_GAIN, MAX_MIC_GAIN, MIC_GAIN_STEP } from '@/constants/micInput';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';

export function MicInputSettings() {
  const [deviceId, setDeviceId] = useMicInputDevice();
  const devices = useMicInputDevices();
  const [gain, setGain] = useMicInputGain();
  const options = [
    { value: SYSTEM_DEFAULT_MIC_INPUT_ID, label: SETTINGS_STRINGS.systemDefaultMicInputOption },
    ...devices.map((device) => ({ value: device.deviceId, label: device.label }))
  ];

  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.micInputTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.micInputHint}</p>
      <div className="mt-5">
        <SelectField label={SETTINGS_STRINGS.micInputFieldLabel} value={deviceId} onChange={setDeviceId} options={options} wide />
      </div>

      <p className="text-xs text-text-dim font-semibold mt-5">{SETTINGS_STRINGS.micSensitivityFieldLabel}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <RangeSlider min={MIN_MIC_GAIN} max={MAX_MIC_GAIN} step={MIC_GAIN_STEP} value={gain} onChange={setGain} />
        <span className="text-text-dim text-xs w-10 text-right">{Math.round(gain * 100)}%</span>
      </div>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.micSensitivityHint}</p>
    </div>
  );
}
