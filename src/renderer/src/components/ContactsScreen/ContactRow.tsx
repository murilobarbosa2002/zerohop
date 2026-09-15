import { ActionButton } from '@/components/ActionButton';
import { playCallContactClickSound, playRemoveContactClickSound } from '@/services/soundEffects';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import type { Contact } from '@shared/contact';

interface ContactRowProps {
  contact: Contact;
  onCall: (contact: Contact) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
}

export function ContactRow({ contact, onCall, onRemove, disabled }: ContactRowProps) {
  return (
    <div className="flex items-center gap-2 bg-panel-2 border border-border rounded-lg px-3 py-2 mt-2">
      <span className="font-bold text-body-sm flex-1 min-w-0 truncate">{contact.name}</span>
      <ActionButton
        type="button"
        variant="primary"
        className="flex-shrink-0"
        disabled={disabled}
        onClick={() => {
          playCallContactClickSound();
          onCall(contact);
        }}
      >
        {CONTACTS_STRINGS.callContactButton}
      </ActionButton>
      <ActionButton
        type="button"
        variant="danger"
        className="flex-shrink-0"
        disabled={disabled}
        onClick={() => {
          playRemoveContactClickSound();
          onRemove(contact.id);
        }}
      >
        {CONTACTS_STRINGS.removeContactButton}
      </ActionButton>
    </div>
  );
}
