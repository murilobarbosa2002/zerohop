import { Logo } from '@/components/Logo';
import { WindowButton } from '@/components/WindowButton';
import { LogsIcon, SettingsIcon, MinimizeIcon, MaximizeIcon, CloseIcon } from '@/components/icons';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { playOpenLogsSound, playOpenSettingsSound } from '@/services/soundEffects';
import { APP_SHELL_STRINGS } from '@/strings/appShell.strings';
import { TITLE_BAR_STRINGS } from '@/strings/titleBar.strings';
import { UPDATES_STRINGS } from '@/strings/updates.strings';
import type { TitleBarProps } from '@/components/TitleBar/TitleBar.types';

export function TitleBar({ onOpenUpdates, onOpenSettings, onOpenLogs }: TitleBarProps) {
  const { version } = useAppUpdater();

  return (
    <div className="h-titlebar-height flex items-center justify-between bg-panel border-b border-border select-none pl-3 [-webkit-app-region:drag]">
      <div className="flex items-center gap-2 text-xs font-bold text-text-dim">
        <div className="w-logo-badge h-logo-badge rounded-window-icon bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center flex-shrink-0">
          <Logo size={11} />
        </div>
        {APP_SHELL_STRINGS.appName}
        {version && (
          <button
            onClick={onOpenUpdates}
            className="text-badge-xs font-normal text-text-dim bg-panel-2 border border-border rounded-full px-2 py-0.5 hover:border-accent [-webkit-app-region:no-drag]"
          >
            {UPDATES_STRINGS.currentVersionLabel(version)}
          </button>
        )}
      </div>
      <div className="flex h-full">
        <WindowButton
          onClick={() => {
            playOpenLogsSound();
            onOpenLogs();
          }}
          label={TITLE_BAR_STRINGS.logsButtonLabel}
        >
          <LogsIcon className="w-3 h-3" />
        </WindowButton>
        <WindowButton
          onClick={() => {
            playOpenSettingsSound();
            onOpenSettings();
          }}
          label={TITLE_BAR_STRINGS.settingsButtonLabel}
        >
          <SettingsIcon className="w-3 h-3" />
        </WindowButton>
        <WindowButton onClick={() => window.api.minimize()} label={TITLE_BAR_STRINGS.minimizeButtonLabel}>
          <MinimizeIcon />
        </WindowButton>
        <WindowButton onClick={() => window.api.maximize()} label={TITLE_BAR_STRINGS.maximizeButtonLabel}>
          <MaximizeIcon />
        </WindowButton>
        <WindowButton onClick={() => window.api.close()} label={TITLE_BAR_STRINGS.closeButtonLabel} danger>
          <CloseIcon />
        </WindowButton>
      </div>
    </div>
  );
}
