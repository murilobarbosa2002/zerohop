import { ActionButton } from '@/components/ActionButton';
import { playOpenProfileClickSound } from '@/services/soundEffects';
import { PROFILE_STRINGS } from '@/strings/profile.strings';
import type { ProfileRequiredNoticeProps } from '@/components/ProfileRequiredNotice.types';

export function ProfileRequiredNotice({ onOpenProfile }: ProfileRequiredNoticeProps) {
  return (
    <div className="bg-panel-2 border border-border rounded-lg px-3 py-2.5 mt-2">
      <p className="font-bold text-body-sm">{PROFILE_STRINGS.requiredNoticeTitle}</p>
      <p className="text-text-dim text-xs mt-1 leading-relaxed">{PROFILE_STRINGS.requiredNoticeBody}</p>
      <ActionButton
        type="button"
        variant="primary"
        size="compact"
        className="w-full mt-2"
        onClick={() => {
          playOpenProfileClickSound();
          onOpenProfile();
        }}
      >
        {PROFILE_STRINGS.requiredNoticeButton}
      </ActionButton>
    </div>
  );
}
