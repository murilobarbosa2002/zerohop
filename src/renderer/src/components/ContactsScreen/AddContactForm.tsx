import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { playErrorSound, playAddContactClickSound } from '@/services/soundEffects';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import { contactFormSchema, type ContactFormValues } from '@/components/ContactsScreen/ContactForm.schema';
import type { Contact } from '@shared/contact';

interface AddContactFormProps {
  onAdd: (contact: Contact) => void;
}

export function AddContactForm({ onAdd }: AddContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', id: '', password: '' }
  });

  function handleAdd(values: ContactFormValues): void {
    playAddContactClickSound();
    onAdd(values);
    reset();
  }

  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.addContactTitle}</p>

      <form>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
          {CONTACTS_STRINGS.contactNameFieldLabel}
          <TextInput
            {...register('name')}
            maxLength={ROOM_NAME_MAX_LENGTH}
            placeholder={CONTACTS_STRINGS.contactNameFieldPlaceholder}
            soundKind={TextInputSoundKind.NAME}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
          {CONTACTS_STRINGS.contactIdFieldLabel}
          <TextInput
            {...register('id')}
            placeholder={CONTACTS_STRINGS.contactIdFieldPlaceholder}
            soundKind={TextInputSoundKind.ROOM_CODE}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
          {CONTACTS_STRINGS.contactPasswordFieldLabel}
          <PasswordInput
            {...register('password')}
            maxLength={ROOM_PASSWORD_MAX_LENGTH}
            placeholder={CONTACTS_STRINGS.contactPasswordFieldPlaceholder}
            soundKind={TextInputSoundKind.PASSWORD}
          />
        </label>

        <ActionButton type="button" variant="primary" className="mt-3 w-full" onClick={handleSubmit(handleAdd, playErrorSound)}>
          {CONTACTS_STRINGS.addContactButton}
        </ActionButton>
      </form>
      {(errors.name || errors.id || errors.password) && (
        <p className="text-danger text-xs mt-2">{CONTACTS_STRINGS.contactFieldsRequiredError}</p>
      )}
    </Card>
  );
}
