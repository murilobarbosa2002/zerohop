import { useState } from 'react';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { useContacts } from '@/hooks/useContacts';
import { useNamePreference } from '@/hooks/useNamePreference';
import { useAvatarId } from '@/hooks/useAvatarId';
import { getRecentContactIds, recordRecentContact } from '@/services/recentContactPreference';
import { errorMessage } from '@/lib/errorMessage';
import { playCallContactClickSound, playErrorSound } from '@/services/soundEffects';
import { HOME_STRINGS } from '@/strings/home.strings';
import type { Contact } from '@shared/contact';
import type { HomeExtrasProps } from '@/components/PreRoom/HomeExtras/HomeExtras.types';

export function RecentContactsPanel({ roomClient, onEntered }: Pick<HomeExtrasProps, 'roomClient' | 'onEntered'>) {
  const { contacts } = useContacts();
  const [name] = useNamePreference();
  const [avatarId] = useAvatarId();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const recentContacts = getRecentContactIds()
    .map((id) => contacts.find((contact) => contact.id === id))
    .filter((contact): contact is Contact => contact !== undefined);

  async function handleCall(contact: Contact): Promise<void> {
    playCallContactClickSound();
    setBusyId(contact.id);
    setStatus(HOME_STRINGS.recentContactsCallingStatus);
    try {
      const code = await roomClient.joinRoom(name, contact.id, contact.password, avatarId);
      recordRecentContact(contact.id);
      onEntered(code);
    } catch (error) {
      setStatus(HOME_STRINGS.recentContactsCallError(errorMessage(error)));
      playErrorSound();
      setBusyId(null);
    }
  }

  if (recentContacts.length === 0) return null;

  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{HOME_STRINGS.recentContactsTitle}</p>
      <div className="flex flex-col gap-2 mt-2">
        {recentContacts.map((contact) => (
          <div key={contact.id} className="flex items-center gap-2 bg-panel-2 border border-border rounded-lg px-3 py-2">
            <span className="font-bold text-body-sm truncate flex-1 min-w-0">{contact.name}</span>
            <ActionButton
              variant="primary"
              className="flex-shrink-0 text-badge-xs"
              disabled={busyId !== null}
              onClick={() => handleCall(contact)}
            >
              {HOME_STRINGS.recentContactsCallButton}
            </ActionButton>
          </div>
        ))}
      </div>
      {status && <p className="text-text-dim text-xs mt-2">{status}</p>}
    </Card>
  );
}
