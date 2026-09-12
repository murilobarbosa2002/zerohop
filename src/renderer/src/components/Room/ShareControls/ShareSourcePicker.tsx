import { useState } from 'react';
import { Card, CardTitle } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { SelectField } from '@/components/SelectField';
import { SourceGrid } from '@/components/Room/ShareControls/SourceGrid';
import { ShareSourceKindChoice } from '@/components/Room/ShareControls/ShareSourceKindChoice';
import { RESOLUTION_OPTIONS, FPS_OPTIONS } from '@/components/Room/ShareControls/qualityOptions';
import { getCaptureSourceKind } from '@/lib/captureSourceKind';
import { CaptureSourceKind } from '@/constants/captureSourceKind';
import { Resolution } from '@/constants/resolution';
import { Fps } from '@/constants/fps';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { ShareSourcePickerProps } from '@/components/Room/ShareControls/ShareSourcePicker.types';

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
  isEditing,
  onConfirm,
  onCancel
}: ShareSourcePickerProps) {
  const [kind, setKind] = useState<CaptureSourceKind | null>(null);
  const filteredSources = kind ? sourcePicker.sources.filter((source) => getCaptureSourceKind(source.id) === kind) : [];

  return (
    <Card>
      <CardTitle badge={1}>{kind ? ROOM_STRINGS.chooseSourceTitle : ROOM_STRINGS.chooseSourceKindTitle}</CardTitle>

      {!kind ? (
        <>
          <ShareSourceKindChoice onSelect={setKind} />
          <ActionButton variant="default" className="mt-3.5" onClick={onCancel}>
            {ROOM_STRINGS.cancelShareSetupButton}
          </ActionButton>
        </>
      ) : (
        <>
          <button onClick={() => setKind(null)} className="text-accent text-body-sm hover:underline mb-3">
            {ROOM_STRINGS.backToSourceKindButton}
          </button>

          {filteredSources.length === 0 ? (
            <p className="text-text-dim text-xs mb-3">
              {kind === CaptureSourceKind.WINDOW ? ROOM_STRINGS.noWindowSourcesMessage : ROOM_STRINGS.noScreenSourcesMessage}
            </p>
          ) : (
            <SourceGrid sources={filteredSources} selectedId={sourcePicker.selectedId} onSelect={sourcePicker.select} />
          )}
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
            <SelectField
              label={ROOM_STRINGS.audioFieldLabel}
              value={audioSelection}
              onChange={onChangeAudioSelection}
              options={audioOptions}
              wide
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-3.5">
            <ActionButton variant="default" className="flex-shrink-0" onClick={onCancel}>
              {ROOM_STRINGS.cancelShareSetupButton}
            </ActionButton>
            <ActionButton variant="primary" className="flex-1 min-w-0" onClick={onConfirm}>
              {isEditing ? ROOM_STRINGS.saveShareChangesButton : ROOM_STRINGS.startSharingButton}
            </ActionButton>
          </div>

          <p className="text-text-dim text-xs leading-relaxed mt-2.5">{ROOM_STRINGS.qualityHint}</p>
          <p className="text-text-dim text-xs leading-relaxed mt-2.5">{ROOM_STRINGS.audioIndependenceHint}</p>
        </>
      )}

      {status && <p className="text-text-dim text-xs mt-2.5">{status}</p>}
    </Card>
  );
}
