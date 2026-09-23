import { Card } from '@/components/Card';
import { useContacts } from '@/hooks/useContacts';
import { useContactsPresence } from '@/hooks/useContactsPresence';
import { HOME_STRINGS } from '@/strings/home.strings';

export function OnlineContactsPanel() {
  const { contacts } = useContacts();
  const onlineStatus = useContactsPresence(contacts);

  const checked = contacts.filter((contact) => onlineStatus.has(contact.id)).length;
  const onlineCount = contacts.filter((contact) => onlineStatus.get(contact.id) === true).length;

  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{HOME_STRINGS.onlineContactsTitle}</p>
      {contacts.length === 0 ? (
        <p className="text-text-dim text-xs mt-1">{HOME_STRINGS.onlineContactsNone}</p>
      ) : checked < contacts.length ? (
        <p className="text-text-dim text-xs mt-1">{HOME_STRINGS.onlineContactsChecking}</p>
      ) : (
        <p className="text-text-dim text-xs mt-1">{HOME_STRINGS.onlineContactsCount(onlineCount, contacts.length)}</p>
      )}
    </Card>
  );
}
