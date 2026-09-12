import { z } from 'zod';
import { ROOM_NAME_MAX_LENGTH, ROOM_CODE_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MIN_LENGTH, ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';

export const joinRoomSchema = z.object({
  name: z.string().trim().max(ROOM_NAME_MAX_LENGTH),
  code: z.string().trim().min(1, { message: PRE_ROOM_STRINGS.codeRequiredError }).max(ROOM_CODE_MAX_LENGTH),
  password: z
    .string()
    .trim()
    .min(ROOM_PASSWORD_MIN_LENGTH, { message: PRE_ROOM_STRINGS.passwordTooShortError })
    .max(ROOM_PASSWORD_MAX_LENGTH)
});

export type JoinRoomFormValues = z.infer<typeof joinRoomSchema>;
