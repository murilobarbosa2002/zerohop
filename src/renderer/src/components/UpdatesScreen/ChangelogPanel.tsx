import { useState } from 'react';
import { ChangelogIndex } from '@/components/UpdatesScreen/ChangelogIndex';
import { ChangelogDetail } from '@/components/UpdatesScreen/ChangelogDetail';

export function ChangelogPanel() {
  const [openPath, setOpenPath] = useState<string | null>(null);

  return openPath ? <ChangelogDetail path={openPath} onBack={() => setOpenPath(null)} /> : <ChangelogIndex onOpenRelease={setOpenPath} />;
}
