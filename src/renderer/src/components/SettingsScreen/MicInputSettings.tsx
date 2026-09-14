import { useState } from 'react';
import { SelectField } from '@/components/SelectField';
import { RangeSlider } from '@/components/RangeSlider';
import { ActionButton } from '@/components/ActionButton';
import { useMicInputDevice } from '@/hooks/useMicInputDevice';
import { useMicInputDevices } from '@/hooks/useMicInputDevices';
import { useMicInputGain } from '@/hooks/useMicInputGain';
import { useNoiseSuppression } from '@/hooks/useNoiseSuppression';
import { useMicActive } from '@/hooks/useMicActive';
import { requestMicPermission } from '@/services/MicCapture';
import { SYSTEM_DEFAULT_MIC_INPUT_ID, MIN_MIC_GAIN, MAX_MIC_GAIN, MIC_GAIN_STEP } from '@/constants/micInput';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';
import type { MicInputSettingsProps } from '@/components/SettingsScreen/MicInputSettings.types';

export function MicInputSettings({ roomClient }: MicInputSettingsProps) {
  const [deviceId, setDeviceId] = useMicInputDevice();
  const devices = useMicInputDevices();
  const [gain, setGain] = useMicInputGain();
  const [noiseSuppression, setNoiseSuppression] = useNoiseSuppression();
  const micActive = useMicActive(roomClient);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const options = [
    { value: SYSTEM_DEFAULT_MIC_INPUT_ID, label: SETTINGS_STRINGS.systemDefaultMicInputOption },
    ...devices.map((device) => ({ value: device.deviceId, label: device.label }))
  ];

  async function handleGrantPermission(): Promise<void> {
    setPermissionStatus(null);
    if (roomClient) {
      await roomClient.retryMicPermission();
      setPermissionStatus(
        roomClient.micActive ? SETTINGS_STRINGS.micPermissionGrantedStatus : SETTINGS_STRINGS.micPermissionStillDeniedStatus
      );
      return;
    }
    const granted = await requestMicPermission();
    setPermissionStatus(granted ? SETTINGS_STRINGS.micPermissionGrantedStatus : SETTINGS_STRINGS.micPermissionStillDeniedStatus);
  }

  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.micInputTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.micInputHint}</p>

      {roomClient && !micActive && <p className="text-warn text-xs mt-2.5 leading-relaxed">{SETTINGS_STRINGS.micPermissionDeniedHint}</p>}
      {!roomClient && <p className="text-text-dim text-xs mt-2.5 leading-relaxed">{SETTINGS_STRINGS.micPermissionOutsideRoomHint}</p>}

      {(!roomClient || !micActive) && (
        <>
          <ActionButton variant="primary" className="mt-2.5" onClick={handleGrantPermission}>
            {SETTINGS_STRINGS.grantMicPermissionButton}
          </ActionButton>
          {permissionStatus && <p className="text-text-dim text-xs mt-2">{permissionStatus}</p>}
        </>
      )}

      <div className="mt-5">
        <SelectField label={SETTINGS_STRINGS.micInputFieldLabel} value={deviceId} onChange={setDeviceId} options={options} wide />
      </div>

      <p className="text-xs text-text-dim font-semibold mt-5">{SETTINGS_STRINGS.micSensitivityFieldLabel}</p>
      <div className="flex items-center gap-2 mt-1.5">
        <RangeSlider min={MIN_MIC_GAIN} max={MAX_MIC_GAIN} step={MIC_GAIN_STEP} value={gain} onChange={setGain} />
        <span className="text-text-dim text-xs w-10 text-right">{Math.round(gain * 100)}%</span>
      </div>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.micSensitivityHint}</p>

      <label className="flex items-center gap-2 text-body-sm mt-5">
        <input type="checkbox" checked={noiseSuppression} onChange={(event) => setNoiseSuppression(event.target.checked)} />
        {SETTINGS_STRINGS.noiseSuppressionToggleLabel}
      </label>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.noiseSuppressionHint}</p>
    </div>
  );
}
