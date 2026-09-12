import { useMemo } from 'react';
import { AudioSourceMode } from '@/constants/audioSourceMode';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { CaptureSource } from '@shared/ipc-types';
import type { SelectOption } from '@/components/SelectField';

const WINDOW_SOURCE_ID_PREFIX = 'window:';

export function useAudioSourceOptions(sources: CaptureSource[]): SelectOption[] {
  return useMemo(() => {
    const windowSources = sources.filter((source) => source.id.startsWith(WINDOW_SOURCE_ID_PREFIX));
    return [
      { value: AudioSourceMode.SAME_AS_VIDEO, label: ROOM_STRINGS.audioSameAsVideoOption },
      { value: AudioSourceMode.NONE, label: ROOM_STRINGS.audioNoneOption },
      ...windowSources.map((source) => ({
        value: source.id,
        label: ROOM_STRINGS.audioOnlyFromOption(source.name)
      }))
    ];
  }, [sources]);
}

export function resolveAudioSourceId(selectedValue: string, videoSourceId: string): string | null {
  if (selectedValue === AudioSourceMode.NONE) return null;
  if (selectedValue === AudioSourceMode.SAME_AS_VIDEO) return videoSourceId;
  return selectedValue;
}
