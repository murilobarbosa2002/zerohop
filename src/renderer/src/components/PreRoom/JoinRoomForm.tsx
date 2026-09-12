import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardTitle } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { errorMessage } from '@/lib/errorMessage';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import { ROOM_NAME_MAX_LENGTH, ROOM_CODE_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { joinRoomSchema, type JoinRoomFormValues } from '@/components/PreRoom/JoinRoomForm.schema';
import type { JoinRoomFormProps } from '@/components/PreRoom/PreRoom.types';

export function JoinRoomForm({ roomClient, onEntered, onBack }: JoinRoomFormProps) {
  const [status, setStatus] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<JoinRoomFormValues>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: { name: '', code: '', password: '' }
  });

  async function handleJoin(values: JoinRoomFormValues): Promise<void> {
    const code = values.code.toUpperCase();
    setStatus(PRE_ROOM_STRINGS.joiningRoomStatus);
    try {
      await roomClient.joinRoom(values.name, code, values.password);
      onEntered(code);
    } catch (error) {
      setStatus(PRE_ROOM_STRINGS.joinRoomError(errorMessage(error)));
    }
  }

  return (
    <Card>
      <CardTitle>{PRE_ROOM_STRINGS.joinRoomTitle}</CardTitle>
      <form>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.nameFieldLabel}
          <input
            type="text"
            {...register('name')}
            maxLength={ROOM_NAME_MAX_LENGTH}
            placeholder={PRE_ROOM_STRINGS.nameFieldPlaceholder}
            className="bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.codeFieldLabel}
          <input
            type="text"
            {...register('code')}
            maxLength={ROOM_CODE_MAX_LENGTH}
            placeholder={PRE_ROOM_STRINGS.codeFieldPlaceholder}
            className="bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.passwordFieldLabel}
          <input
            type="password"
            {...register('password')}
            maxLength={ROOM_PASSWORD_MAX_LENGTH}
            placeholder={PRE_ROOM_STRINGS.joinPasswordFieldPlaceholder}
            className="bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder"
          />
        </label>

        <div className="flex gap-2 mt-2">
          <ActionButton type="button" variant="default" onClick={onBack}>
            {PRE_ROOM_STRINGS.backButton}
          </ActionButton>
          <ActionButton type="button" variant="primary" className="flex-1" onClick={handleSubmit(handleJoin)}>
            {PRE_ROOM_STRINGS.joinRoomButton}
          </ActionButton>
        </div>
      </form>

      {errors.code && <p className="text-text-dim text-xs mt-2">{errors.code.message}</p>}
      {errors.password && <p className="text-text-dim text-xs mt-2">{errors.password.message}</p>}
      {status && <p className="text-text-dim text-xs mt-2">{status}</p>}
    </Card>
  );
}
