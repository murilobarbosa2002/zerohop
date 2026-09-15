import { useState } from 'react';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { TextInputSoundKind } from '@/constants/textInputSoundKind';
import { ROOM_NAME_MAX_LENGTH } from '@/constants/roomIdentity';
import { ROOM_PASSWORD_MAX_LENGTH } from '@/constants/roomPassword';
import { playErrorSound, playAddContactClickSound } from '@/services/soundEffects';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import type { Contact } from '@shared/contact';

interface AddContactFormProps {
  onAdd: (contact: Contact) => void;
}

export function AddContactForm({ onAdd }: AddContactFormProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(): void {
    if (!name.trim() || !id.trim() || !password.trim()) {
      setError(CONTACTS_STRINGS.contactFieldsRequiredError);
      playErrorSound();
      return;
    }
    setError('');
    playAddContactClickSound();
    onAdd({ name: name.trim(), id: id.trim(), password: password.trim() });
    setName('');
    setId('');
    setPassword('');
  }

  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.addContactTitle}</p>

      <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
        {CONTACTS_STRINGS.contactNameFieldLabel}
        <TextInput
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={ROOM_NAME_MAX_LENGTH}
          placeholder={CONTACTS_STRINGS.contactNameFieldPlaceholder}
          soundKind={TextInputSoundKind.NAME}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
        {CONTACTS_STRINGS.contactIdFieldLabel}
        <TextInput
          value={id}
          onChange={(event) => setId(event.target.value)}
          placeholder={CONTACTS_STRINGS.contactIdFieldPlaceholder}
          soundKind={TextInputSoundKind.ROOM_CODE}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs text-text-dim font-semibold mt-3">
        {CONTACTS_STRINGS.contactPasswordFieldLabel}
        <PasswordInput
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          maxLength={ROOM_PASSWORD_MAX_LENGTH}
          placeholder={CONTACTS_STRINGS.contactPasswordFieldPlaceholder}
          soundKind={TextInputSoundKind.PASSWORD}
        />
      </label>

      <ActionButton type="button" variant="primary" className="mt-3 w-full" onClick={handleSubmit}>
        {CONTACTS_STRINGS.addContactButton}
      </ActionButton>
      {error && <p className="text-danger text-xs mt-2">{error}</p>}
    </Card>
  );
}
