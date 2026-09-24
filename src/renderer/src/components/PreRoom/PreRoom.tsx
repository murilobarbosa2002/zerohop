import { useState } from 'react';
import { PreRoomChoice } from '@/components/PreRoom/PreRoomChoice';
import { HomeExtras } from '@/components/PreRoom/HomeExtras';
import { CreateRoomForm } from '@/components/PreRoom/CreateRoomForm';
import { JoinRoomForm } from '@/components/PreRoom/JoinRoomForm';
import { ContactsScreen } from '@/components/ContactsScreen';
import { ProfileRequiredNotice } from '@/components/ProfileRequiredNotice';
import { useHasProfileConfigured } from '@/hooks/useHasProfileConfigured';
import { PreRoomScreen } from '@/constants/preRoomScreen';
import type { PreRoomProps } from '@/components/PreRoom/PreRoom.types';

export function PreRoom({
  roomClient,
  onEntered,
  initialScreen = PreRoomScreen.CHOICE,
  onOpenUpdates,
  onOpenPersonalRoomSettings,
  onOpenProfile
}: PreRoomProps) {
  const [screen, setScreen] = useState<PreRoomScreen>(initialScreen);
  const [showProfileRequired, setShowProfileRequired] = useState(false);
  const hasProfileConfigured = useHasProfileConfigured();

  function requireProfileThenGo(nextScreen: PreRoomScreen): void {
    if (!hasProfileConfigured) {
      setShowProfileRequired(true);
      return;
    }
    setShowProfileRequired(false);
    setScreen(nextScreen);
  }

  return screen === PreRoomScreen.CREATE ? (
    <CreateRoomForm roomClient={roomClient} onEntered={onEntered} onBack={() => setScreen(PreRoomScreen.CHOICE)} />
  ) : screen === PreRoomScreen.JOIN ? (
    <JoinRoomForm roomClient={roomClient} onEntered={onEntered} onBack={() => setScreen(PreRoomScreen.CHOICE)} />
  ) : screen === PreRoomScreen.CONTACTS ? (
    <ContactsScreen
      roomClient={roomClient}
      onEntered={onEntered}
      onBack={() => setScreen(PreRoomScreen.CHOICE)}
      onOpenProfile={onOpenProfile}
    />
  ) : (
    <div className="max-w-contacts-screen mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <div className="flex flex-col gap-4">
        <PreRoomChoice
          onSelectCreate={() => requireProfileThenGo(PreRoomScreen.CREATE)}
          onSelectJoin={() => requireProfileThenGo(PreRoomScreen.JOIN)}
          onSelectContacts={() => setScreen(PreRoomScreen.CONTACTS)}
          onSelectProfile={onOpenProfile}
        />
        {showProfileRequired && <ProfileRequiredNotice onOpenProfile={onOpenProfile} />}
      </div>
      <HomeExtras
        roomClient={roomClient}
        onEntered={onEntered}
        onOpenUpdates={onOpenUpdates}
        onOpenPersonalRoomSettings={onOpenPersonalRoomSettings}
        onOpenProfile={onOpenProfile}
      />
    </div>
  );
}
