import { useState } from 'react';
import { Card } from '@/components/Card';
import { CopyButton } from '@/components/CopyButton';
import { ActionButton } from '@/components/ActionButton';
import { ProfileRequiredNotice } from '@/components/ProfileRequiredNotice';
import { usePersonalRoom } from '@/hooks/usePersonalRoom';
import { useNamePreference } from '@/hooks/useNamePreference';
import { useAvatarId } from '@/hooks/useAvatarId';
import { useHasProfileConfigured } from '@/hooks/useHasProfileConfigured';
import { ROOM_PASSWORD_MIN_LENGTH } from '@/constants/roomPassword';
import { errorMessage } from '@/lib/errorMessage';
import { playOpenPersonalRoomClickSound, playOpenSettingsSound, playErrorSound } from '@/services/soundEffects';
import { HOME_STRINGS } from '@/strings/home.strings';
import type { PersonalIdPanelProps } from '@/components/PreRoom/HomeExtras/PersonalIdPanel.types';

export function PersonalIdPanel({ roomClient, onEntered, onOpenPersonalRoomSettings, onOpenProfile }: PersonalIdPanelProps) {
  const personalRoom = usePersonalRoom();
  const [name] = useNamePreference();
  const [avatarId] = useAvatarId();
  const hasProfileConfigured = useHasProfileConfigured();
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleOpenPersonalRoom(): Promise<void> {
    if (!hasProfileConfigured) return;
    if (personalRoom.password.trim().length < ROOM_PASSWORD_MIN_LENGTH) {
      setStatus(HOME_STRINGS.personalRoomPasswordMissingError);
      playErrorSound();
      return;
    }
    setBusy(true);
    setStatus(HOME_STRINGS.personalRoomOpeningStatus);
    try {
      const code = await roomClient.createRoom(name, personalRoom.password, avatarId, personalRoom.id);
      onEntered(code);
    } catch (error) {
      setStatus(HOME_STRINGS.personalRoomOpenError(errorMessage(error)));
      playErrorSound();
      setBusy(false);
    }
  }

  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{HOME_STRINGS.personalIdTitle}</p>
      <p className="text-text-dim text-xs mt-1">{HOME_STRINGS.personalIdHint}</p>
      <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0 mt-2.5">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono font-bold tracking-wide text-accent truncate">{personalRoom.id}</span>
          <CopyButton text={personalRoom.id} />
        </div>
      </div>
      {!hasProfileConfigured && <ProfileRequiredNotice onOpenProfile={onOpenProfile} />}
      <div className="flex gap-2 mt-2.5">
        <ActionButton
          type="button"
          variant="primary"
          className="flex-1"
          disabled={busy || !hasProfileConfigured}
          onClick={() => {
            playOpenPersonalRoomClickSound();
            handleOpenPersonalRoom();
          }}
        >
          {HOME_STRINGS.personalRoomOpenButton}
        </ActionButton>
        <ActionButton
          type="button"
          variant="default"
          className="flex-1"
          onClick={() => {
            playOpenSettingsSound();
            onOpenPersonalRoomSettings();
          }}
        >
          {HOME_STRINGS.personalRoomConfigureButton}
        </ActionButton>
      </div>
      {status && <p className="text-text-dim text-xs mt-2">{status}</p>}
    </Card>
  );
}
