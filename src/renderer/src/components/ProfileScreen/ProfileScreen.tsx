import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { AvatarPicker } from '@/components/AvatarPicker';
import { Avatar } from '@/components/Avatar';
import { useNamePreference } from '@/hooks/useNamePreference';
import { useAvatarId } from '@/hooks/useAvatarId';
import { useStatusPreference } from '@/hooks/useStatusPreference';
import { playBackButtonSound } from '@/services/soundEffects';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { STATUS_MAX_LENGTH } from '@/constants/status';
import { PROFILE_STRINGS } from '@/strings/profile.strings';
import type { ProfileScreenProps } from '@/components/ProfileScreen/ProfileScreen.types';

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [name, setName] = useNamePreference();
  const [avatarId, setAvatarId] = useAvatarId();
  const [status, setStatus] = useStatusPreference();
  const avatarInitial = (name || '?').charAt(0).toUpperCase();

  return (
    <div className="max-w-modal mx-auto">
      <Card>
        <Header />
        <div className="flex items-center gap-3 mb-4">
          <ActionButton
            type="button"
            variant="default"
            onClick={() => {
              playBackButtonSound();
              onBack();
            }}
          >
            {PROFILE_STRINGS.backButton}
          </ActionButton>
          <p className="font-bold text-body-sm-alt">{PROFILE_STRINGS.screenTitle}</p>
        </div>

        <div className="bg-panel-2 border border-border rounded-lg px-3 py-2.5 mb-4 flex items-center gap-3 min-w-0">
          <Avatar avatarId={avatarId} fallbackLetter={avatarInitial} size={36} />
          <div className="min-w-0">
            <p className="font-bold text-body-sm-alt truncate">{name || PROFILE_STRINGS.previewEmptyName}</p>
            {status && <p className="text-text-dim text-body-xs truncate">{status}</p>}
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-4">
          {PROFILE_STRINGS.nameFieldLabel}
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={ROOM_NAME_MAX_LENGTH}
            placeholder={PROFILE_STRINGS.nameFieldPlaceholder}
            soundKind={TextInputSoundKind.NAME}
          />
        </label>

        <div className="mb-4">
          <AvatarPicker value={avatarId} onChange={setAvatarId} />
        </div>

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
          {PROFILE_STRINGS.statusFieldLabel}
          <TextInput
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            maxLength={STATUS_MAX_LENGTH}
            placeholder={PROFILE_STRINGS.statusFieldPlaceholder}
            soundKind={TextInputSoundKind.STATUS}
          />
        </label>
        <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{PROFILE_STRINGS.statusFieldHint}</p>
      </Card>
    </div>
  );
}
