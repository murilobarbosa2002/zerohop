import { useState } from 'react';
import { PreRoomChoice } from '@/components/PreRoom/PreRoomChoice';
import { HomeExtras } from '@/components/PreRoom/HomeExtras';
import { CreateRoomForm } from '@/components/PreRoom/CreateRoomForm';
import { JoinRoomForm } from '@/components/PreRoom/JoinRoomForm';
import { ContactsScreen } from '@/components/ContactsScreen';
import { PreRoomScreen } from '@/constants/preRoomScreen';
import type { PreRoomProps } from '@/components/PreRoom/PreRoom.types';

export function PreRoom({
  roomClient,
  onEntered,
  findSessionByRoomCode,
  initialScreen = PreRoomScreen.CHOICE,
  focusContactsPassword = false,
  onOpenUpdates
}: PreRoomProps) {
  const [screen, setScreen] = useState<PreRoomScreen>(initialScreen);

  return screen === PreRoomScreen.CREATE ? (
    <CreateRoomForm roomClient={roomClient} onEntered={onEntered} onBack={() => setScreen(PreRoomScreen.CHOICE)} />
  ) : screen === PreRoomScreen.JOIN ? (
    <JoinRoomForm roomClient={roomClient} onEntered={onEntered} onBack={() => setScreen(PreRoomScreen.CHOICE)} />
  ) : screen === PreRoomScreen.CONTACTS ? (
    <ContactsScreen
      roomClient={roomClient}
      onEntered={onEntered}
      onBack={() => setScreen(PreRoomScreen.CHOICE)}
      findSessionByRoomCode={findSessionByRoomCode}
      autoFocusPersonalPassword={focusContactsPassword}
    />
  ) : (
    <div className="max-w-contacts-screen mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <PreRoomChoice
        onSelectCreate={() => setScreen(PreRoomScreen.CREATE)}
        onSelectJoin={() => setScreen(PreRoomScreen.JOIN)}
        onSelectContacts={() => setScreen(PreRoomScreen.CONTACTS)}
      />
      <HomeExtras roomClient={roomClient} onEntered={onEntered} onOpenUpdates={onOpenUpdates} />
    </div>
  );
}
