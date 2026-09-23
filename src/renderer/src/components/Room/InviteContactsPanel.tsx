import { useState } from 'react';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { playInviteContactSentSound } from '@/services/soundEffects';
import { ROOM_STRINGS } from '@/strings/room.strings';
import type { InviteContactsPanelProps } from '@/components/Room/InviteContactsPanel.types';

export function InviteContactsPanel({
  contacts,
  members,
  hasContactJoinedViaInvite,
  onInvite,
  failedContactIds
}: InviteContactsPanelProps) {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  function handleInvite(contactId: string): void {
    const contact = contacts.find((current) => current.id === contactId);
    if (!contact) return;
    playInviteContactSentSound();
    onInvite(contact);
    setSentIds((current) => new Set(current).add(contactId));
  }

  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{ROOM_STRINGS.inviteContactsPanelButton}</p>
      <p className="text-text-dim text-xs mt-1.5 leading-relaxed">{ROOM_STRINGS.inviteContactsPanelHint}</p>

      {contacts.length === 0 ? (
        <p className="text-text-dim text-xs mt-2">{ROOM_STRINGS.inviteContactsPanelEmptyMessage}</p>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          {contacts.map((contact) => {
            const alreadyInRoom = members.some((member) => member.personalId === contact.id);
            const failed = failedContactIds.has(contact.id);
            const alreadySent = !failed && (sentIds.has(contact.id) || hasContactJoinedViaInvite(contact.id));
            return (
              <div key={contact.id} className="flex items-center gap-2 bg-panel-2 border border-border rounded-lg px-3 py-2">
                <span className="font-bold text-body-sm truncate flex-1 min-w-0">{contact.name}</span>
                {alreadyInRoom ? (
                  <span className="text-text-dim text-body-xs font-bold flex-shrink-0">{ROOM_STRINGS.inviteContactAlreadyInRoomLabel}</span>
                ) : failed ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-danger text-body-xs font-bold">{ROOM_STRINGS.inviteContactFailedLabel}</span>
                    <ActionButton variant="default" className="text-body-xs" onClick={() => handleInvite(contact.id)}>
                      {ROOM_STRINGS.inviteContactRetryButton}
                    </ActionButton>
                  </div>
                ) : alreadySent ? (
                  <span className="text-text-dim text-body-xs font-bold flex-shrink-0">{ROOM_STRINGS.inviteContactSentLabel}</span>
                ) : (
                  <ActionButton variant="primary" className="flex-shrink-0 text-body-xs" onClick={() => handleInvite(contact.id)}>
                    {ROOM_STRINGS.inviteContactButton}
                  </ActionButton>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
