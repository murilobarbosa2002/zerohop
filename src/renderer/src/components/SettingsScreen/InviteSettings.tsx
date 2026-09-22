import { useAllowUnknownInvites } from '@/hooks/useAllowUnknownInvites';
import { playPersonalAutoOpenToggleSound } from '@/services/soundEffects';
import { SETTINGS_STRINGS } from '@/strings/settings.strings';

export function InviteSettings() {
  const [allowUnknownInvites, setAllowUnknownInvites] = useAllowUnknownInvites();

  return (
    <div className="max-w-modal mt-6">
      <p className="font-bold text-lg">{SETTINGS_STRINGS.invitesTitle}</p>
      <label className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2 mt-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-accent flex-shrink-0"
          checked={allowUnknownInvites}
          onChange={(event) => {
            playPersonalAutoOpenToggleSound();
            setAllowUnknownInvites(event.target.checked);
          }}
        />
        <span className="font-bold text-body-sm">{SETTINGS_STRINGS.allowUnknownInvitesToggleLabel}</span>
      </label>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{SETTINGS_STRINGS.allowUnknownInvitesHint}</p>
    </div>
  );
}
