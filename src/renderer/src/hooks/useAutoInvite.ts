import { useEffect } from 'react';
import { AUTO_INVITE_RETRY_INTERVAL_MS } from '@/constants/timing';
import type { RoomClient } from '@/services/RoomClient';
import type { Contact } from '@shared/contact';

export function useAutoInvite(roomClient: RoomClient | null, contacts: Contact[], inviteContactIds: string[]): void {
  useEffect(() => {
    if (!roomClient || inviteContactIds.length === 0) return;

    function tick(): void {
      for (const id of inviteContactIds) {
        const contact = contacts.find((current) => current.id === id);
        if (!contact || roomClient!.hasContactJoinedViaInvite(contact.id)) continue;
        roomClient!.inviteContact(contact);
      }
    }

    tick();
    const interval = setInterval(tick, AUTO_INVITE_RETRY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [roomClient, contacts, inviteContactIds]);
}
