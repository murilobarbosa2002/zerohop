import { BrowserWindow } from 'electron';
import { getSettings } from '@main/settings';
import { appendLog } from '@main/logger';
import { HOTKEYS_STRINGS } from '@main/strings/hotkeys.strings';
import { HOTKEYS_INIT_TIMEOUT_MS } from '@main/constants/hotkeys';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import { LogCategory, LogLevel } from '@shared/logEntry';

type UiohookModule = typeof import('uiohook-napi');
type UiohookKeyboardEvent = import('uiohook-napi').UiohookKeyboardEvent;

const UIOHOOK_NAME_OVERRIDES: Record<string, string> = {
  Enter: 'Return',
  NumpadEnter: 'Return',
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  CapsLock: 'Capslock'
};

const UIOHOOK_MODIFIER_NAMES = new Set(['Ctrl', 'CtrlRight', 'Alt', 'AltRight', 'Shift', 'ShiftRight', 'Meta', 'MetaRight']);

let uiohookModule: UiohookModule | null = null;
let started = false;
let pttHeld = false;
let pttReleaseTimeout: ReturnType<typeof setTimeout> | null = null;
let acceleratorKeyByCode: Map<number, string> | null = null;

async function loadUiohook(): Promise<UiohookModule | null> {
  if (uiohookModule) return uiohookModule;
  try {
    uiohookModule = await import('uiohook-napi');
    return uiohookModule;
  } catch {
    return null;
  }
}

function getAcceleratorKey(keycode: number): string | null {
  if (!acceleratorKeyByCode && uiohookModule) {
    acceleratorKeyByCode = new Map(
      Object.entries(uiohookModule.UiohookKey)
        .filter(([name]) => !UIOHOOK_MODIFIER_NAMES.has(name))
        .map(([name, code]) => [code, UIOHOOK_NAME_OVERRIDES[name] ?? name])
    );
  }
  return acceleratorKeyByCode?.get(keycode) ?? null;
}

function sendToRenderers(channel: string, ...args: unknown[]): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(channel, ...args);
  }
}

function matchesPushToTalk(keycode: number): boolean {
  const { hotkeys } = getSettings();
  if (!hotkeys.pushToTalkHotkey) return false;
  const key = getAcceleratorKey(keycode);
  return key !== null && key === hotkeys.pushToTalkHotkey.accelerator;
}

function handleKeyDown(event: UiohookKeyboardEvent): void {
  if (!matchesPushToTalk(event.keycode)) return;
  if (pttReleaseTimeout) {
    clearTimeout(pttReleaseTimeout);
    pttReleaseTimeout = null;
  }
  if (!pttHeld) {
    pttHeld = true;
    sendToRenderers(IPC_CHANNELS.hotkeyPttActiveChanged, true);
  }
}

function handleKeyUp(event: UiohookKeyboardEvent): void {
  if (!matchesPushToTalk(event.keycode) || !pttHeld) return;
  const { hotkeys } = getSettings();
  pttReleaseTimeout = setTimeout(() => {
    pttHeld = false;
    pttReleaseTimeout = null;
    sendToRenderers(IPC_CHANNELS.hotkeyPttActiveChanged, false);
  }, hotkeys.pushToTalkReleaseDelayMs);
}

function timeout(ms: number): Promise<'timeout'> {
  return new Promise((resolve) => setTimeout(() => resolve('timeout'), ms));
}

export async function startGlobalHotkeys(): Promise<void> {
  if (started) return;
  appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.INFO, message: HOTKEYS_STRINGS.captureStartingMessage });

  const mod = await Promise.race([loadUiohook(), timeout(HOTKEYS_INIT_TIMEOUT_MS)]);
  if (mod === 'timeout') {
    appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.WARNING, message: HOTKEYS_STRINGS.captureLoadTimedOutMessage });
    return;
  }
  if (!mod) {
    appendLog({ category: LogCategory.HOTKEYS, level: LogLevel.WARNING, message: HOTKEYS_STRINGS.captureUnavailableMessage });
    return;
  }

  try {
    mod.uIOhook.on('keydown', handleKeyDown);
    mod.uIOhook.on('keyup', handleKeyUp);
    const startResult = await Promise.race([Promise.resolve().then(() => mod.uIOhook.start()), timeout(HOTKEYS_INIT_TIMEOUT_MS)]);
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
  if (!started || !uiohookModule) return;
  try {
    uiohookModule.uIOhook.stop();
  } catch {}
  started = false;
}
