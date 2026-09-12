import { Logo } from '@/components/Logo';
import { WindowButton } from '@/components/WindowButton';
import { useAppUpdater } from '@/hooks/useAppUpdater';
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
        <WindowButton onClick={onOpenLogs} label={TITLE_BAR_STRINGS.logsButtonLabel}>
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true">
            <line x1="2" y1="3" x2="10" y2="3" />
            <line x1="2" y1="6" x2="10" y2="6" />
            <line x1="2" y1="9" x2="7" y2="9" />
          </svg>
        </WindowButton>
        <WindowButton onClick={onOpenSettings} label={TITLE_BAR_STRINGS.settingsButtonLabel}>
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
            <circle cx="6" cy="6" r="1.8" />
            <path d="M6 0.8v1.4M6 9.8v1.4M11.2 6H9.8M2.2 6H0.8M9.5 2.5l-1 1M3.5 8.5l-1 1M9.5 9.5l-1-1M3.5 3.5l-1-1" />
          </svg>
        </WindowButton>
        <WindowButton onClick={() => window.api.minimize()} label={TITLE_BAR_STRINGS.minimizeButtonLabel}>
          <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true">
            <rect x="1" y="5.5" width="10" height="1.2" fill="currentColor" />
          </svg>
        </WindowButton>
        <WindowButton onClick={() => window.api.maximize()} label={TITLE_BAR_STRINGS.maximizeButtonLabel}>
          <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true">
            <rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </WindowButton>
        <WindowButton onClick={() => window.api.close()} label={TITLE_BAR_STRINGS.closeButtonLabel} danger>
          <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true">
            <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </WindowButton>
      </div>
    </div>
  );
}
