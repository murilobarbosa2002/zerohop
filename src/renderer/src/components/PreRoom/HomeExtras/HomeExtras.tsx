import { PersonalIdPanel } from '@/components/PreRoom/HomeExtras/PersonalIdPanel';
import { OnlineContactsPanel } from '@/components/PreRoom/HomeExtras/OnlineContactsPanel';
import { RecentContactsPanel } from '@/components/PreRoom/HomeExtras/RecentContactsPanel';
import { ChangelogTeaserPanel } from '@/components/PreRoom/HomeExtras/ChangelogTeaserPanel';
import { RetroClockTipPanel } from '@/components/PreRoom/HomeExtras/RetroClockTipPanel';
import type { HomeExtrasProps } from '@/components/PreRoom/HomeExtras/HomeExtras.types';

export function HomeExtras({ roomClient, onEntered, onOpenUpdates, onOpenPersonalRoomSettings, onOpenProfile }: HomeExtrasProps) {
  return (
    <div className="flex flex-col gap-4">
      <RetroClockTipPanel />
      <PersonalIdPanel
        roomClient={roomClient}
        onEntered={onEntered}
        onOpenPersonalRoomSettings={onOpenPersonalRoomSettings}
        onOpenProfile={onOpenProfile}
      />
      <OnlineContactsPanel />
      <RecentContactsPanel roomClient={roomClient} onEntered={onEntered} onOpenProfile={onOpenProfile} />
      <ChangelogTeaserPanel onOpenUpdates={onOpenUpdates} />
    </div>
  );
}
