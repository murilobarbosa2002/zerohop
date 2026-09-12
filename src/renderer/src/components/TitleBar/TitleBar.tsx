import { Logo } from '@/components/Logo';
import { WindowButton } from '@/components/WindowButton';
import { APP_SHELL_STRINGS } from '@/strings/appShell.strings';
import { TITLE_BAR_STRINGS } from '@/strings/titleBar.strings';

export function TitleBar() {
  return (
    <div className="h-titlebar-height flex items-center justify-between bg-panel border-b border-border select-none pl-3 [-webkit-app-region:drag]">
      <div className="flex items-center gap-2 text-xs font-bold text-text-dim">
        <div className="w-logo-badge h-logo-badge rounded-window-icon bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center flex-shrink-0">
          <Logo size={11} />
        </div>
        {APP_SHELL_STRINGS.appName}
      </div>
      <div className="flex h-full">
        <WindowButton onClick={() => window.api.minimize()} label={TITLE_BAR_STRINGS.minimizeButtonLabel}>
          <svg viewBox="0 0 12 12" className="w-3 h-3">
            <rect x="1" y="5.5" width="10" height="1.2" fill="currentColor" />
          </svg>
        </WindowButton>
        <WindowButton onClick={() => window.api.maximize()} label={TITLE_BAR_STRINGS.maximizeButtonLabel}>
          <svg viewBox="0 0 12 12" className="w-3 h-3">
            <rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </WindowButton>
        <WindowButton onClick={() => window.api.close()} label={TITLE_BAR_STRINGS.closeButtonLabel} danger>
          <svg viewBox="0 0 12 12" className="w-3 h-3">
            <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </WindowButton>
      </div>
    </div>
  );
}
