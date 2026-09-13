import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardTitle } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { errorMessage } from '@/lib/errorMessage';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { createRoomSchema, type CreateRoomFormValues } from '@/components/PreRoom/CreateRoomForm.schema';
import type { CreateRoomFormProps } from '@/components/PreRoom/PreRoom.types';

export function CreateRoomForm({ roomClient, onEntered, onBack }: CreateRoomFormProps) {
  const [status, setStatus] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { name: '', password: '' }
  });

  async function handleCreate(values: CreateRoomFormValues): Promise<void> {
    setStatus(PRE_ROOM_STRINGS.creatingRoomStatus);
    try {
      const roomCode = await roomClient.createRoom(values.name, values.password);
      onEntered(roomCode);
    } catch (error) {
      setStatus(PRE_ROOM_STRINGS.createRoomError(errorMessage(error)));
    }
  }

  return (
    <Card>
      <CardTitle>{PRE_ROOM_STRINGS.createRoomTitle}</CardTitle>
      <form>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.nameFieldLabel}
          <TextInput
            type="text"
            {...register('name')}
            maxLength={ROOM_NAME_MAX_LENGTH}
            placeholder={PRE_ROOM_STRINGS.nameFieldPlaceholder}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.passwordFieldLabel}
          <PasswordInput
            {...register('password')}
            maxLength={ROOM_PASSWORD_MAX_LENGTH}
            placeholder={PRE_ROOM_STRINGS.passwordFieldPlaceholder}
          />
        </label>

        <div className="flex gap-2 mt-2">
          <ActionButton type="button" variant="default" onClick={onBack}>
            {PRE_ROOM_STRINGS.backButton}
          </ActionButton>
          <ActionButton type="button" variant="primary" className="flex-1" onClick={handleSubmit(handleCreate)}>
            {PRE_ROOM_STRINGS.createRoomButton}
          </ActionButton>
        </div>
      </form>

      {errors.password && <p className="text-text-dim text-xs mt-2">{errors.password.message}</p>}
      {status && <p className="text-text-dim text-xs mt-2">{status}</p>}
    </Card>
  );
}
