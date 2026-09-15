import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardTitle } from '@/components/Card';
import { Header } from '@/components/Header';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { AvatarPicker } from '@/components/AvatarPicker';
import { useAvatarId } from '@/hooks/useAvatarId';
import { useContacts } from '@/hooks/useContacts';
import { getName, setName } from '@/services/namePreference';
import { errorMessage } from '@/lib/errorMessage';
import { playErrorSound, playBackButtonSound, playInviteContactToggleSound } from '@/services/soundEffects';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { createRoomSchema, type CreateRoomFormValues } from '@/components/PreRoom/CreateRoomForm.schema';
import type { CreateRoomFormProps } from '@/components/PreRoom/PreRoom.types';

export function CreateRoomForm({ roomClient, onEntered, onBack }: CreateRoomFormProps) {
  const [status, setStatus] = useState('');
  const [avatarId, setAvatarId] = useAvatarId();
  const { contacts } = useContacts();
  const [invitedContactIds, setInvitedContactIds] = useState<Set<string>>(new Set());
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { name: getName(), password: '' }
  });

  function toggleInvitedContact(id: string): void {
    playInviteContactToggleSound();
    setInvitedContactIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCreate(values: CreateRoomFormValues): Promise<void> {
    setName(values.name);
    setStatus(PRE_ROOM_STRINGS.creatingRoomStatus);
    try {
      const invitedContacts = contacts.filter((contact) => invitedContactIds.has(contact.id));
      const roomCode = await roomClient.createRoom(values.name, values.password, avatarId, undefined, invitedContacts);
      onEntered(roomCode);
    } catch (error) {
      setStatus(PRE_ROOM_STRINGS.createRoomError(errorMessage(error)));
      playErrorSound();
    }
  }

  return (
    <Card>
      <Header />
      <CardTitle>{PRE_ROOM_STRINGS.createRoomTitle}</CardTitle>
      <form>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.nameFieldLabel}
          <TextInput
            type="text"
            {...register('name')}
            maxLength={ROOM_NAME_MAX_LENGTH}
            placeholder={PRE_ROOM_STRINGS.nameFieldPlaceholder}
            soundKind={TextInputSoundKind.NAME}
          />
        </label>

        <AvatarPicker value={avatarId} onChange={setAvatarId} />

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.passwordFieldLabel}
          <PasswordInput
            {...register('password')}
            maxLength={ROOM_PASSWORD_MAX_LENGTH}
            placeholder={PRE_ROOM_STRINGS.passwordFieldPlaceholder}
            soundKind={TextInputSoundKind.PASSWORD}
          />
        </label>

        {contacts.length > 0 && (
          <div className="mb-3">
            <p className="text-body-sm">{CONTACTS_STRINGS.inviteContactsTitle}</p>
            <p className="text-text-dim text-xs mt-1 leading-relaxed">{CONTACTS_STRINGS.inviteContactsHint}</p>
            <div className="mt-2">
              {contacts.map((contact) => (
                <label
                  key={contact.id}
                  className="flex items-center gap-2 bg-panel-2 border border-border rounded-lg px-3 py-2 mt-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-accent flex-shrink-0"
                    checked={invitedContactIds.has(contact.id)}
                    onChange={() => toggleInvitedContact(contact.id)}
                  />
                  <span className="font-bold text-body-sm truncate">{contact.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <ActionButton
            type="button"
            variant="default"
            onClick={() => {
              playBackButtonSound();
              onBack();
            }}
          >
            {PRE_ROOM_STRINGS.backButton}
          </ActionButton>
          <ActionButton type="button" variant="primary" className="flex-1" onClick={handleSubmit(handleCreate, playErrorSound)}>
            {PRE_ROOM_STRINGS.createRoomButton}
          </ActionButton>
        </div>
      </form>

      {errors.name && <p className="text-text-dim text-xs mt-2">{errors.name.message}</p>}
      {errors.password && <p className="text-text-dim text-xs mt-2">{errors.password.message}</p>}
      {status && <p className="text-text-dim text-xs mt-2">{status}</p>}
    </Card>
  );
}
