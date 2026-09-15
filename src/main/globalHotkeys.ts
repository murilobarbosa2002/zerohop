import { BrowserWindow } from 'electron';
import { getSettings } from '@main/settings';
import { appendLog } from '@main/logger';
import { HOTKEYS_STRINGS } from '@main/strings/hotkeys.strings';
import { HOTKEYS_INIT_TIMEOUT_MS } from '@main/constants/hotkeys';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import { LogCategory, LogLevel } from '@shared/logEntry';
import type { HotkeyBinding } from '@shared/hotkeySettings';

type KeyListenerModule = typeof import('node-global-key-listener');
type GlobalKeyEvent = import('node-global-key-listener').IGlobalKeyEvent;

let keyListenerModule: KeyListenerModule | null = null;
let listener: InstanceType<KeyListenerModule['GlobalKeyboardListener']> | null = null;
let started = false;
let pttHeld = false;
let pttReleaseTimeout: ReturnType<typeof setTimeout> | null = null;
let recordingCallback: ((binding: HotkeyBinding) => void) | null = null;

async function loadKeyListener(): Promise<KeyListenerModule | null> {
  if (keyListenerModule) return keyListenerModule;
  try {
    keyListenerModule = await import('node-global-key-listener');
    return keyListenerModule;
  } catch {
    return null;
  }
}

function sendToRenderers(channel: string, ...args: unknown[]): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(channel, ...args);
  }
}

function handleKeyEvent(event: GlobalKeyEvent): void {
  const key = event.name;
  if (!key) return;

  if (event.state === 'DOWN' && recordingCallback) {
    const callback = recordingCallback;
    recordingCallback = null;
    callback({ key, label: key });
    return;
  }

  const { hotkeys } = getSettings();
  if (!hotkeys.pushToTalkHotkey || key !== hotkeys.pushToTalkHotkey.key) return;

  if (event.state === 'DOWN') {
    if (pttReleaseTimeout) {
      clearTimeout(pttReleaseTimeout);
      pttReleaseTimeout = null;
    }
    if (!pttHeld) {
      pttHeld = true;
      sendToRenderers(IPC_CHANNELS.hotkeyPttActiveChanged, true);
    }
  } else if (event.state === 'UP' && pttHeld) {
    pttReleaseTimeout = setTimeout(() => {
      pttHeld = false;
      pttReleaseTimeout = null;
      sendToRenderers(IPC_CHANNELS.hotkeyPttActiveChanged, false);
    }, hotkeys.pushToTalkReleaseDelayMs);
  }
}

function timeout(ms: number): Promise<'timeout'> {
  return new Promise((resolve) => setTimeout(() => resolve('timeout'), ms));
}

export async function startGlobalHotkeys(): Promise<void> {
  if (started) return;
  appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.INFO, message: HOTKEYS_STRINGS.captureStartingMessage });

  const mod = await Promise.race([loadKeyListener(), timeout(HOTKEYS_INIT_TIMEOUT_MS)]);
  if (mod === 'timeout') {
    appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.WARNING, message: HOTKEYS_STRINGS.captureLoadTimedOutMessage });
    return;
  }
  if (!mod) {
    appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.WARNING, message: HOTKEYS_STRINGS.captureUnavailableMessage });
    return;
  }

  try {
    listener = new mod.GlobalKeyboardListener({
      windows: {
        onError: (errorCode) =>
          appendLog({
            category: LogCategory.HOTKEYS,
            level: LogLevel.WARNING,
            message: HOTKEYS_STRINGS.captureRuntimeErrorMessage,
            detail: `HRESULT/código: ${errorCode}`
          }),
        onInfo: (info) => appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.INFO, message: info })
      }
    });
    const startResult = await Promise.race([listener.addListener(handleKeyEvent), timeout(HOTKEYS_INIT_TIMEOUT_MS)]);
    if (startResult === 'timeout') {
      appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.WARNING, message: HOTKEYS_STRINGS.captureStartTimedOutMessage });
      return;
    }
    started = true;
    appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.INFO, message: HOTKEYS_STRINGS.captureActiveMessage });
  } catch (error) {
    appendLog({
      category: LogCategory.HOTKEYS,
      level: LogLevel.WARNING,
      message: HOTKEYS_STRINGS.captureUnavailableMessage,
      detail: (error as Error).message
    });
  }
}

export function stopGlobalHotkeys(): void {
  if (!started || !listener) return;
  try {
    listener.kill();
  } catch {}
  listener = null;
  started = false;
}

export function recordNextHotkey(callback: (binding: HotkeyBinding) => void): void {
  recordingCallback = callback;
}

export function cancelHotkeyRecording(): void {
  recordingCallback = null;
}
