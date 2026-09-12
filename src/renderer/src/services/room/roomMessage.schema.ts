import { z } from 'zod';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/constants/chat';

export const memberInfoSchema = z.object({
  id: z.string(),
  name: z.string()
});

export const helloMessageSchema = z.object({
  type: z.literal('hello'),
  name: z.string(),
  password: z.string()
});

export const membersMessageSchema = z.object({
  type: z.literal('members'),
  members: z.array(memberInfoSchema)
});

export const sharingStatusMessageSchema = z.object({
  type: z.literal('sharing-status'),
  sharing: z.boolean()
});

export const watchRequestMessageSchema = z.object({
  type: z.literal('watch-request')
});

export const unwatchRequestMessageSchema = z.object({
  type: z.literal('unwatch-request')
});

export const kickMessageSchema = z.object({
  type: z.literal('kick'),
  targetId: z.string()
});

export const chatMessageSchema = z.object({
  type: z.literal('chat'),
  text: z.string().trim().min(1).max(CHAT_MESSAGE_MAX_LENGTH)
});

export const roomMessageSchema = z.discriminatedUnion('type', [
  helloMessageSchema,
  membersMessageSchema,
  sharingStatusMessageSchema,
  watchRequestMessageSchema,
  unwatchRequestMessageSchema,
  kickMessageSchema,
  chatMessageSchema
]);
