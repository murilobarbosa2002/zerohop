import type { CaptureSourceKind } from '@/constants/captureSourceKind';

export interface ShareSourceKindChoiceProps {
  onSelect: (kind: CaptureSourceKind) => void;
}
