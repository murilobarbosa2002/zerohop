import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { PreRoomChoiceOption } from '@/components/PreRoom/PreRoomChoiceOption';
import { PlusCircleIcon, EnterDoorIcon, PeopleIcon, ProfileIcon } from '@/components/icons';
import {
  playCreateRoomClickSound,
  playJoinRoomClickSound,
  playOpenContactsClickSound,
  playOpenProfileClickSound
} from '@/services/soundEffects';
import { PRE_ROOM_STRINGS } from '@/strings/preRoom.strings';
import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
import { PROFILE_STRINGS } from '@/strings/profile.strings';
import type { PreRoomChoiceProps } from '@/components/PreRoom/PreRoom.types';

export function PreRoomChoice({ onSelectCreate, onSelectJoin, onSelectContacts, onSelectProfile }: PreRoomChoiceProps) {
  return (
    <Card>
      <Header />
      <p className="text-text-dim text-xs font-semibold mb-3">{PRE_ROOM_STRINGS.choiceHint}</p>
      <div className="flex flex-col gap-2.5">
        <PreRoomChoiceOption
          primary
          icon={<PlusCircleIcon />}
          title={PRE_ROOM_STRINGS.createRoomButton}
          hint={PRE_ROOM_STRINGS.createRoomHint}
          onClick={() => {
            playCreateRoomClickSound();
            onSelectCreate();
          }}
        />
        <PreRoomChoiceOption
          icon={<EnterDoorIcon />}
          title={PRE_ROOM_STRINGS.joinRoomButton}
          hint={PRE_ROOM_STRINGS.joinRoomHint}
          onClick={() => {
            playJoinRoomClickSound();
            onSelectJoin();
          }}
        />
        <PreRoomChoiceOption
          icon={<PeopleIcon />}
          title={CONTACTS_STRINGS.contactsButton}
          hint={CONTACTS_STRINGS.contactsHint}
          onClick={() => {
            playOpenContactsClickSound();
            onSelectContacts();
          }}
        />
        <PreRoomChoiceOption
          icon={<ProfileIcon />}
          title={PROFILE_STRINGS.screenTitle}
          hint={PROFILE_STRINGS.profileTileHint}
          onClick={() => {
            playOpenProfileClickSound();
            onSelectProfile();
          }}
        />
      </div>
    </Card>
  );
}
