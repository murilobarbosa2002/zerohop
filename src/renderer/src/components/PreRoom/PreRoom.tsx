import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardTitle } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { errorMessage } from '@/lib/errorMessage';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import { preRoomSchema, type PreRoomFormValues } from '@/components/PreRoom/PreRoom.schema';
import type { PreRoomProps } from '@/components/PreRoom/PreRoom.types';

export function PreRoom({ roomClient, onEntered }: PreRoomProps) {
  const [status, setStatus] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<PreRoomFormValues>({
    resolver: zodResolver(preRoomSchema),
    defaultValues: { name: '', code: '', password: '' }
  });

  async function handleCreate(values: PreRoomFormValues): Promise<void> {
    setStatus(PRE_ROOM_STRINGS.creatingRoomStatus);
    try {
      const roomCode = await roomClient.createRoom(values.name, values.password);
      onEntered(roomCode);
    } catch (error) {
      setStatus(PRE_ROOM_STRINGS.createRoomError(errorMessage(error)));
    }
  }

  async function handleJoin(values: PreRoomFormValues): Promise<void> {
    const code = values.code.toUpperCase();
    if (!code) {
      setError('code', { message: PRE_ROOM_STRINGS.codeRequiredError });
      return;
    }
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
      <CardTitle>{PRE_ROOM_STRINGS.title}</CardTitle>
      <form>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.nameFieldLabel}
          <input
            type="text"
            {...register('name')}
            maxLength={24}
            placeholder={PRE_ROOM_STRINGS.nameFieldPlaceholder}
            className="bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mb-3">
          {PRE_ROOM_STRINGS.passwordFieldLabel}
          <input
            type="password"
            {...register('password')}
            maxLength={24}
            placeholder={PRE_ROOM_STRINGS.passwordFieldPlaceholder}
            className="bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder"
          />
        </label>

        <div className="flex gap-4 mt-2 flex-wrap items-stretch">
          <div className="flex-1 min-w-form-column flex flex-col justify-end gap-2">
            <ActionButton type="button" variant="primary" onClick={handleSubmit(handleCreate)}>
              {PRE_ROOM_STRINGS.createRoomButton}
            </ActionButton>
          </div>
          <div className="flex flex-col items-center gap-2 text-text-dim text-xs">
            <span className="flex-1 w-px bg-border" />
            {PRE_ROOM_STRINGS.orSeparator}
            <span className="flex-1 w-px bg-border" />
          </div>
          <div className="flex-1 min-w-form-column flex flex-col justify-end gap-2">
            <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
              {PRE_ROOM_STRINGS.codeFieldLabel}
              <input
                type="text"
                {...register('code')}
                maxLength={12}
                placeholder={PRE_ROOM_STRINGS.codeFieldPlaceholder}
                className="bg-input-bg text-text border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-placeholder"
              />
            </label>
            <ActionButton type="button" variant="primary" onClick={handleSubmit(handleJoin)}>
              {PRE_ROOM_STRINGS.joinRoomButton}
            </ActionButton>
          </div>
        </div>
      </form>

      {errors.code && <p className="text-text-dim text-xs mt-2">{errors.code.message}</p>}
      {status && <p className="text-text-dim text-xs mt-2">{status}</p>}
    </Card>
  );
}
