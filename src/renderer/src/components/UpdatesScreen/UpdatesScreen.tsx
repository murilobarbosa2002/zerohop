import { useState } from 'react';
import { UpdateStatusPanel } from '@/components/UpdatesScreen/UpdateStatusPanel';
import { ChangelogPanel } from '@/components/UpdatesScreen/ChangelogPanel';
import { ReleaseHistoryPanel } from '@/components/UpdatesScreen/ReleaseHistoryPanel';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { UpdatesTab } from '@/constants/updatesTab';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import { navItemVariants } from '@/components/UpdatesScreen/UpdatesScreen.variants';
import { playTabStatusSound, playTabChangelogSound, playTabVersionsSound } from '@/services/soundEffects';
import type { UpdatesScreenProps } from '@/components/UpdatesScreen/UpdatesScreen.types';

const NAV_ITEMS: { tab: UpdatesTab; label: string; playSound: () => void }[] = [
  { tab: UpdatesTab.STATUS, label: UPDATES_STRINGS.statusTab, playSound: playTabStatusSound },
  { tab: UpdatesTab.CHANGELOG, label: UPDATES_STRINGS.changelogTab, playSound: playTabChangelogSound },
  { tab: UpdatesTab.VERSIONS, label: UPDATES_STRINGS.versionsTab, playSound: playTabVersionsSound }
];

export function UpdatesScreen({ onBack }: UpdatesScreenProps) {
  const [tab, setTab] = useState<UpdatesTab>(UpdatesTab.STATUS);
  const updater = useAppUpdater();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border flex-shrink-0">
        <button onClick={onBack} className="text-badge-xs font-bold text-text-dim bg-panel-2 border border-border rounded-full px-3 py-1 hover:border-accent">
          {UPDATES_STRINGS.backButton}
        </button>
        <p className="font-bold text-body-sm-alt">{UPDATES_STRINGS.modalTitle}</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-room-sidebar-width flex-shrink-0 border-r border-border p-4 flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                if (tab !== item.tab) item.playSound();
                setTab(item.tab);
              }}
              className={navItemVariants({ active: tab === item.tab })}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === UpdatesTab.STATUS && <UpdateStatusPanel {...updater} />}
          {tab === UpdatesTab.CHANGELOG && <ChangelogPanel />}
          {tab === UpdatesTab.VERSIONS && <ReleaseHistoryPanel currentVersion={updater.version} />}
        </div>
      </div>
    </div>
  );
}
