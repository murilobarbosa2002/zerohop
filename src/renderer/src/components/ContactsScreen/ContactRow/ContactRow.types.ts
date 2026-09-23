import type { Contact } from '@shared/contact';

export interface ContactRowProps {
  contact: Contact;
  onCall: (contact: Contact) => void;
  onEdit: (originalId: string, contact: Contact) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
  online: boolean | undefined;
}

export interface ContactRowViewProps {
  contact: Contact;
  onCall: (contact: Contact) => void;
  onEditClick: () => void;
  onRemove: (id: string) => void;
  disabled: boolean;
  online: boolean | undefined;
}

export interface ContactRowEditFormProps {
  contact: Contact;
  onSave: (originalId: string, contact: Contact) => void;
  onCancel: () => void;
}
