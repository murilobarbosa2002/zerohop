import { Card, CardTitle } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { SelectField } from '@/components/SelectField';
import { SourceGrid } from '@/components/Room/SourceGrid';
import { RESOLUTION_OPTIONS, FPS_OPTIONS } from '@/components/Room/qualityOptions';
import { Resolution } from '@/constants/resolution';
import { Fps } from '@/constants/fps';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { ShareSourcePickerProps } from '@/components/Room/ShareSourcePicker.types';

export function ShareSourcePicker({
  sourcePicker,
  resolution,
  onChangeResolution,
  fps,
  onChangeFps,
  audioSelection,
  onChangeAudioSelection,
  audioOptions,
  status,
  onConfirm,
  onCancel
}: ShareSourcePickerProps) {
  return (
    <Card>
      <CardTitle badge={1}>{ROOM_STRINGS.chooseSourceTitle}</CardTitle>
      <SourceGrid sources={sourcePicker.sources} selectedId={sourcePicker.selectedId} onSelect={sourcePicker.select} />
      <ActionButton onClick={() => sourcePicker.refresh()}>{ROOM_STRINGS.refreshSourcesButton}</ActionButton>

      <div className="flex gap-5 mt-3.5 flex-wrap items-end">
        <SelectField
          label={ROOM_STRINGS.resolutionFieldLabel}
          value={resolution}
          onChange={(value) => onChangeResolution(value as Resolution)}
          options={RESOLUTION_OPTIONS}
        />
        <SelectField
          label={ROOM_STRINGS.fpsFieldLabel}
          value={fps}
          onChange={(value) => onChangeFps(value as Fps)}
          options={FPS_OPTIONS}
        />
        <SelectField label={ROOM_STRINGS.audioFieldLabel} value={audioSelection} onChange={onChangeAudioSelection} options={audioOptions} />
      </div>

      <div className="flex gap-2 mt-3.5">
        <ActionButton variant="default" onClick={onCancel}>
          {ROOM_STRINGS.cancelShareSetupButton}
        </ActionButton>
        <ActionButton variant="primary" className="flex-1" onClick={onConfirm}>
          {ROOM_STRINGS.startSharingButton}
        </ActionButton>
      </div>

      <p className="text-text-dim text-xs leading-relaxed mt-2.5">{ROOM_STRINGS.qualityHint}</p>
      <p className="text-text-dim text-xs leading-relaxed mt-2.5">{ROOM_STRINGS.audioIndependenceHint}</p>

      {status && <p className="text-text-dim text-xs mt-2.5">{status}</p>}
    </Card>
  );
}
