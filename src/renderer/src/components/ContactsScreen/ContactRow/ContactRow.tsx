import { useState } from 'react';
import { ContactRowView } from '@/components/ContactsScreen/ContactRow/ContactRowView';
import { ContactRowEditForm } from '@/components/ContactsScreen/ContactRow/ContactRowEditForm';
import { playEditContactOpenSound } from '@/services/soundEffects';
import type { ContactRowProps } from '@/components/ContactsScreen/ContactRow/ContactRow.types';

export function ContactRow({ contact, onCall, onEdit, onRemove, disabled, online }: ContactRowProps) {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <ContactRowEditForm
      contact={contact}
      onSave={(originalId, updatedContact) => {
        onEdit(originalId, updatedContact);
        setEditing(false);
      }}
      onCancel={() => setEditing(false)}
    />
  ) : (
    <ContactRowView
      contact={contact}
      onCall={onCall}
      onEditClick={() => {
        playEditContactOpenSound();
        setEditing(true);
      }}
      onRemove={onRemove}
      disabled={disabled}
      online={online}
    />
  );
}
