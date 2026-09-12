import { useState } from 'react';
import { PreRoomChoice } from '@/components/PreRoom/PreRoomChoice';
import { CreateRoomForm } from '@/components/PreRoom/CreateRoomForm';
import { JoinRoomForm } from '@/components/PreRoom/JoinRoomForm';
import { PreRoomScreen } from '@/constants/preRoomScreen';
import type { PreRoomProps } from '@/components/PreRoom/PreRoom.types';

export function PreRoom({ roomClient, onEntered }: PreRoomProps) {
  const [screen, setScreen] = useState<PreRoomScreen>(PreRoomScreen.CHOICE);

  return screen === PreRoomScreen.CREATE ? (
    <CreateRoomForm roomClient={roomClient} onEntered={onEntered} onBack={() => setScreen(PreRoomScreen.CHOICE)} />
  ) : screen === PreRoomScreen.JOIN ? (
    <JoinRoomForm roomClient={roomClient} onEntered={onEntered} onBack={() => setScreen(PreRoomScreen.CHOICE)} />
  ) : (
    <PreRoomChoice onSelectCreate={() => setScreen(PreRoomScreen.CREATE)} onSelectJoin={() => setScreen(PreRoomScreen.JOIN)} />
  );
}
