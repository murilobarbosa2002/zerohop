import { Card } from '@/components/Card';
import { CopyButton } from '@/components/CopyButton';
import { usePersonalRoom } from '@/hooks/usePersonalRoom';
import { HOME_STRINGS } from '@/strings/home.strings';

export function PersonalIdPanel() {
  const personalRoom = usePersonalRoom();

  return (
    <Card muted>
      <p className="font-bold text-body-sm-alt">{HOME_STRINGS.personalIdTitle}</p>
      <p className="text-text-dim text-xs mt-1">{HOME_STRINGS.personalIdHint}</p>
      <div className="bg-panel-2 border border-border rounded-lg px-3 py-2 min-w-0 mt-2.5">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono font-bold tracking-wide text-accent truncate">{personalRoom.id}</span>
          <CopyButton text={personalRoom.id} />
        </div>
      </div>
    </Card>
  );
}
