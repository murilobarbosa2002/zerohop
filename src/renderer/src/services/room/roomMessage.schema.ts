import { z } from 'zod';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/constants/chat';

export const memberInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarId: z.string()
});

export const helloMessageSchema = z.object({
  type: z.literal('hello'),
  name: z.string(),
  avatarId: z.string(),
  password: z.string(),
  appVersion: z.string(),
  inviteToken: z.string().optional(),
  personalId: z.string().optional()
});

export const membersMessageSchema = z.object({
  type: z.literal('members'),
  members: z.array(memberInfoSchema)
});

export const sharingStatusMessageSchema = z.object({
  type: z.literal('sharing-status'),
  sharing: z.boolean()
});

export const micStatusMessageSchema = z.object({
  type: z.literal('mic-status'),
  muted: z.boolean()
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
  id: z.string(),
  text: z.string().trim().min(1).max(CHAT_MESSAGE_MAX_LENGTH)
});

export const deleteChatMessageSchema = z.object({
  type: z.literal('delete-message'),
  id: z.string()
});

export const joinPendingMessageSchema = z.object({
  type: z.literal('join-pending')
});

export const joinApprovedMessageSchema = z.object({
  type: z.literal('join-approved')
});

export const inviteMessageSchema = z.object({
  type: z.literal('invite'),
  roomCode: z.string(),
  roomPassword: z.string(),
  inviteToken: z.string(),
  hostId: z.string(),
  hostName: z.string(),
  hostAvatarId: z.string()
});

export const roomMessageSchema = z.discriminatedUnion('type', [
  helloMessageSchema,
  membersMessageSchema,
  sharingStatusMessageSchema,
  micStatusMessageSchema,
  watchRequestMessageSchema,
  unwatchRequestMessageSchema,
  kickMessageSchema,
  chatMessageSchema,
  deleteChatMessageSchema,
  joinPendingMessageSchema,
  joinApprovedMessageSchema,
  inviteMessageSchema
]);
