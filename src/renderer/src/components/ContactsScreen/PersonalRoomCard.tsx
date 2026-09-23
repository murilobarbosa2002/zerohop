import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { CopyButton } from '@/components/CopyButton';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { playOpenPersonalRoomClickSound } from '@/services/soundEffects';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';

interface PersonalRoomCardProps {
  id: string;
  password: string;
  onChangePassword: (value: string) => void;
  onOpen: () => void;
  status: string;
  autoFocusPassword: boolean;
}

export function PersonalRoomCard({ id, password, onChangePassword, onOpen, status, autoFocusPassword }: PersonalRoomCardProps) {
  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.personalRoomTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{CONTACTS_STRINGS.personalRoomHint}</p>

      <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0 mt-3">
        <span className="text-body-xs text-text-dim block mb-1">{CONTACTS_STRINGS.personalIdLabel}</span>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono font-bold tracking-wide text-accent truncate">{id}</span>
          <CopyButton text={id} />
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
        {CONTACTS_STRINGS.personalPasswordLabel}
        <PasswordInput
          value={password}
          onChange={(event) => onChangePassword(event.target.value)}
          maxLength={ROOM_PASSWORD_MAX_LENGTH}
          placeholder={CONTACTS_STRINGS.personalPasswordPlaceholder}
          soundKind={TextInputSoundKind.PASSWORD}
          autoFocus={autoFocusPassword}
        />
      </label>

      <ActionButton
        type="button"
        variant="primary"
        className="mt-3 w-full"
        onClick={() => {
          playOpenPersonalRoomClickSound();
          onOpen();
        }}
      >
        {CONTACTS_STRINGS.openPersonalRoomButton}
      </ActionButton>
      {status && <p className="text-text-dim text-xs mt-2">{status}</p>}
    </Card>
  );
}
