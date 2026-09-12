import { Logo } from '@/components/Logo';
import { APP_SHELL_STRINGS } from '@/strings/appShell.strings';

export function Header() {
  return (
    <div className="flex items-center gap-3.5 mb-6">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center flex-shrink-0 shadow-glow-accent">
        <Logo size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold m-0">{APP_SHELL_STRINGS.appName}</h1>
        <p className="mt-0.5 text-sm text-text-dim">{APP_SHELL_STRINGS.appTagline}</p>
      </div>
    </div>
  );
}
