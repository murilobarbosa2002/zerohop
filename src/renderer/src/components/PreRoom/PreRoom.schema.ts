import { z } from 'zod';

export const preRoomSchema = z.object({
  name: z.string().trim().max(24),
  code: z.string().trim().max(12),
  password: z.string().trim().max(24)
});

export type PreRoomFormValues = z.infer<typeof preRoomSchema>;
