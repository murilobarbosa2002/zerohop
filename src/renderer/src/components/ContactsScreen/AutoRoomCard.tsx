import { Card } from '@/components/Card';
import { CopyButton } from '@/components/CopyButton';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { playInviteContactToggleSound, playAutoRoomEnabledToggleSound } from '@/services/soundEffects';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import type { AutoRoomCardProps } from '@/components/ContactsScreen/AutoRoomCard.types';

export function AutoRoomCard({
  id,
  password,
  onChangePassword,
  enabled,
  onToggleEnabled,
  contacts,
  inviteContactIds,
  onToggleInviteContact
}: AutoRoomCardProps) {
  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.autoRoomTitle}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{CONTACTS_STRINGS.autoRoomHint}</p>

      <label className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2 mt-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-accent flex-shrink-0"
          checked={enabled}
          onChange={(event) => {
            playAutoRoomEnabledToggleSound();
            onToggleEnabled(event.target.checked);
          }}
        />
        <span className="font-bold text-body-sm">{CONTACTS_STRINGS.autoRoomEnabledLabel}</span>
      </label>

      <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0 mt-3">
        <span className="text-body-xs text-text-dim block mb-1">{CONTACTS_STRINGS.autoRoomIdLabel}</span>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono font-bold tracking-wide text-accent truncate">{id}</span>
          <CopyButton text={id} />
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
        {CONTACTS_STRINGS.autoRoomPasswordLabel}
        <PasswordInput
          value={password}
          onChange={(event) => onChangePassword(event.target.value)}
          maxLength={ROOM_PASSWORD_MAX_LENGTH}
          placeholder={CONTACTS_STRINGS.autoRoomPasswordPlaceholder}
          soundKind={TextInputSoundKind.PASSWORD}
        />
      </label>

      <p className="text-body-sm mt-3">{CONTACTS_STRINGS.autoRoomInviteListTitle}</p>
      {contacts.length === 0 ? (
        <p className="text-text-dim text-xs mt-2">{CONTACTS_STRINGS.autoRoomNoContactsMessage}</p>
      ) : (
        <div className="mt-2">
          {contacts.map((contact) => (
            <label
              key={contact.id}
              className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2 mt-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-accent flex-shrink-0"
                checked={inviteContactIds.includes(contact.id)}
                onChange={() => {
                  playInviteContactToggleSound();
                  onToggleInviteContact(contact.id);
                }}
              />
              <span className="font-bold text-body-sm truncate">{contact.name}</span>
            </label>
          ))}
        </div>
      )}
    </Card>
  );
}
