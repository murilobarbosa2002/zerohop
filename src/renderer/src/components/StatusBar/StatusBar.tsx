import { RoomStatus } from '@/constants/roomStatus';
import { APP_SHELL_STRINGS } from '@/strings/appShell.strings';
import { statusDotVariants } from '@/components/StatusBar/StatusBar.variants';
import type { StatusBarProps } from '@/components/StatusBar/StatusBar.types';

export function StatusBar({ status }: StatusBarProps) {
  const connected = status === RoomStatus.CONNECTED;
  return (
    <div className="flex items-center gap-2 text-body-sm text-text-dim">
      <span className={statusDotVariants({ connected })} />
      {connected ? APP_SHELL_STRINGS.connectedStatus : APP_SHELL_STRINGS.disconnectedStatus}
    </div>
  );
}
