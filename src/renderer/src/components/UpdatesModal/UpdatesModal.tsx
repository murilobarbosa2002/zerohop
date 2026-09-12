import { useState } from 'react';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { UpdateStatusPanel } from '@/components/UpdatesModal/UpdateStatusPanel';
import { ChangelogPanel } from '@/components/UpdatesModal/ChangelogPanel';
import { ReleaseHistoryPanel } from '@/components/UpdatesModal/ReleaseHistoryPanel';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { UpdatesTab } from '@/constants/updatesTab';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { UpdatesModalProps } from '@/components/UpdatesModal/UpdatesModal.types';

export function UpdatesModal({ open, onClose }: UpdatesModalProps) {
  const [tab, setTab] = useState<UpdatesTab>(UpdatesTab.STATUS);
  const updater = useAppUpdater();

  return !open ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-4" onClick={onClose}>
      <div className="w-full max-w-modal" onClick={(event) => event.stopPropagation()}>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-body-sm-alt">{UPDATES_STRINGS.modalTitle}</p>
            <button onClick={onClose} className="text-text-dim hover:text-text text-sm">
              {UPDATES_STRINGS.closeButton}
            </button>
          </div>

          <div className="flex gap-2 mb-3.5">
            <ActionButton variant={tab === UpdatesTab.STATUS ? 'primary' : 'default'} onClick={() => setTab(UpdatesTab.STATUS)}>
              {UPDATES_STRINGS.statusTab}
            </ActionButton>
            <ActionButton variant={tab === UpdatesTab.CHANGELOG ? 'primary' : 'default'} onClick={() => setTab(UpdatesTab.CHANGELOG)}>
              {UPDATES_STRINGS.changelogTab}
            </ActionButton>
            <ActionButton variant={tab === UpdatesTab.VERSIONS ? 'primary' : 'default'} onClick={() => setTab(UpdatesTab.VERSIONS)}>
              {UPDATES_STRINGS.versionsTab}
            </ActionButton>
          </div>

          {tab === UpdatesTab.STATUS && <UpdateStatusPanel {...updater} />}
          {tab === UpdatesTab.CHANGELOG && <ChangelogPanel />}
          {tab === UpdatesTab.VERSIONS && <ReleaseHistoryPanel currentVersion={updater.version} />}
        </Card>
      </div>
    </div>
  );
}
