import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { playEditContactSaveSound, playEditContactCancelSound, playErrorSound } from '@/services/soundEffects';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import { contactFormSchema, type ContactFormValues } from '@/components/ContactsScreen/ContactForm.schema';
import type { ContactRowEditFormProps } from '@/components/ContactsScreen/ContactRow/ContactRow.types';

export function ContactRowEditForm({ contact, onSave, onCancel }: ContactRowEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contact
  });

  function handleSave(values: ContactFormValues): void {
    playEditContactSaveSound();
    onSave(contact.id, values);
  }

  function handleCancel(): void {
    playEditContactCancelSound();
    onCancel();
  }

  return (
    <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 mt-2">
      <form>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold">
          {CONTACTS_STRINGS.contactNameFieldLabel}
          <TextInput {...register('name')} maxLength={ROOM_NAME_MAX_LENGTH} soundKind={TextInputSoundKind.NAME} />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-2">
          {CONTACTS_STRINGS.contactIdFieldLabel}
          <TextInput {...register('id')} soundKind={TextInputSoundKind.ROOM_CODE} />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-2">
          {CONTACTS_STRINGS.contactPasswordFieldLabel}
          <PasswordInput {...register('password')} maxLength={ROOM_PASSWORD_MAX_LENGTH} soundKind={TextInputSoundKind.PASSWORD} />
        </label>
        {(errors.name || errors.id || errors.password) && (
          <p className="text-danger text-xs mt-1.5">{CONTACTS_STRINGS.contactFieldsRequiredError}</p>
        )}
        <div className="flex gap-2 mt-2.5">
          <ActionButton type="button" variant="default" className="flex-1" onClick={handleCancel}>
            {CONTACTS_STRINGS.editContactCancelButton}
          </ActionButton>
          <ActionButton type="button" variant="primary" className="flex-1" onClick={handleSubmit(handleSave, playErrorSound)}>
            {CONTACTS_STRINGS.editContactSaveButton}
          </ActionButton>
        </div>
      </form>
    </div>
  );
}
