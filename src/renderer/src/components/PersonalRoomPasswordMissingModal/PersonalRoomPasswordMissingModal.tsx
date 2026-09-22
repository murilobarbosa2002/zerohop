import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { playOpenContactsClickSound, playPersonalRoomPasswordReminderDismissSound } from '@/services/soundEffects';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import type { PersonalRoomPasswordMissingModalProps } from '@/components/PersonalRoomPasswordMissingModal/PersonalRoomPasswordMissingModal.types';

export function PersonalRoomPasswordMissingModal({ onSetPasswordNow, onDismiss }: PersonalRoomPasswordMissingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4">
      <div className="w-full max-w-modal">
        <Card>
          <p className="font-bold text-body-sm-alt">{CONTACTS_STRINGS.personalPasswordMissingPopupTitle}</p>
          <p className="text-text-dim text-xs mt-1.5">{CONTACTS_STRINGS.personalPasswordMissingPopupBody}</p>
          <div className="flex gap-2 mt-3.5">
            <ActionButton
              variant="default"
              className="flex-1"
              onClick={() => {
                playPersonalRoomPasswordReminderDismissSound();
                onDismiss();
              }}
            >
              {CONTACTS_STRINGS.personalPasswordMissingPopupDismissButton}
            </ActionButton>
            <ActionButton
              variant="primary"
              className="flex-1"
              onClick={() => {
                playOpenContactsClickSound();
                onSetPasswordNow();
              }}
            >
              {CONTACTS_STRINGS.personalPasswordMissingPopupSetNowButton}
            </ActionButton>
          </div>
        </Card>
      </div>
    </div>
  );
}
