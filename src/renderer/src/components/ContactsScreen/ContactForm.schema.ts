import { z } from 'zod';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, { message: CONTACTS_STRINGS.contactFieldsRequiredError }).max(ROOM_NAME_MAX_LENGTH),
  id: z.string().trim().min(1, { message: CONTACTS_STRINGS.contactFieldsRequiredError }),
  password: z.string().trim().min(1, { message: CONTACTS_STRINGS.contactFieldsRequiredError }).max(ROOM_PASSWORD_MAX_LENGTH)
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
