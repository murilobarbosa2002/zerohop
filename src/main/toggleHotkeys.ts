import { BrowserWindow, globalShortcut } from 'electron';
import { appendLog } from '@main/logger';
import { HOTKEYS_STRINGS } from '@main/strings/hotkeys.strings';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import { LogCategory, LogLevel } from '@shared/logEntry';
import type { HotkeySettings, ToggleHotkeyRegistrationResult } from '@shared/hotkeySettings';

let registeredMicMuteAccelerator: string | null = null;
let registeredDeafenAccelerator: string | null = null;

function sendToRenderers(channel: string): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(channel);
  }
}

export function applyToggleHotkeys(hotkeys: HotkeySettings): ToggleHotkeyRegistrationResult {
  if (registeredMicMuteAccelerator) globalShortcut.unregister(registeredMicMuteAccelerator);
  if (registeredDeafenAccelerator) globalShortcut.unregister(registeredDeafenAccelerator);
  registeredMicMuteAccelerator = null;
  registeredDeafenAccelerator = null;

  const result: ToggleHotkeyRegistrationResult = { micMuteFailed: false, deafenFailed: false };

  if (hotkeys.micMuteHotkey) {
    const registered = globalShortcut.register(hotkeys.micMuteHotkey.accelerator, () => sendToRenderers(IPC_CHANNELS.hotkeyMicMuteToggle));
    if (registered) {
      registeredMicMuteAccelerator = hotkeys.micMuteHotkey.accelerator;
    } else {
      result.micMuteFailed = true;
      appendLog({
        category: LogCategory.HOTKEYS,
        level: LogLevel.WARNING,
        message: HOTKEYS_STRINGS.acceleratorConflictMessage(hotkeys.micMuteHotkey.label)
      });
    }
  }

  if (hotkeys.deafenHotkey) {
    const registered = globalShortcut.register(hotkeys.deafenHotkey.accelerator, () => sendToRenderers(IPC_CHANNELS.hotkeyDeafenToggle));
    if (registered) {
      registeredDeafenAccelerator = hotkeys.deafenHotkey.accelerator;
    } else {
      result.deafenFailed = true;
      appendLog({
        category: LogCategory.HOTKEYS,
        level: LogLevel.WARNING,
        message: HOTKEYS_STRINGS.acceleratorConflictMessage(hotkeys.deafenHotkey.label)
      });
    }
  }

  return result;
}
