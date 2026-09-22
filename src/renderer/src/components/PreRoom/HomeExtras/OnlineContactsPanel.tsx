import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { useContacts } from '@/hooks/useContacts';
import { watchContactsPresence } from '@/services/contactPresence';
import { HOME_STRINGS } from '@/strings/home.strings';

export function OnlineContactsPanel() {
  const { contacts } = useContacts();
  const [onlineStatus, setOnlineStatus] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    setOnlineStatus(new Map());
    if (contacts.length === 0) return;
    return watchContactsPresence(
      contacts.map((contact) => contact.id),
      (contactId, online) => setOnlineStatus((current) => new Map(current).set(contactId, online))
    );
  }, [contacts]);

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
