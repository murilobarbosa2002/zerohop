import { PersonalIdPanel } from '@/components/PreRoom/HomeExtras/PersonalIdPanel';
import { OnlineContactsPanel } from '@/components/PreRoom/HomeExtras/OnlineContactsPanel';
import { RecentContactsPanel } from '@/components/PreRoom/HomeExtras/RecentContactsPanel';
import { ChangelogTeaserPanel } from '@/components/PreRoom/HomeExtras/ChangelogTeaserPanel';
import { RetroClockTipPanel } from '@/components/PreRoom/HomeExtras/RetroClockTipPanel';
import type { HomeExtrasProps } from '@/components/PreRoom/HomeExtras/HomeExtras.types';

export function HomeExtras({ roomClient, onEntered, onOpenUpdates }: HomeExtrasProps) {
  return (
    <div className="flex flex-col gap-4">
      <RetroClockTipPanel />
      <PersonalIdPanel />
      <OnlineContactsPanel />
      <RecentContactsPanel roomClient={roomClient} onEntered={onEntered} />
      <ChangelogTeaserPanel onOpenUpdates={onOpenUpdates} />
    </div>
  );
}
