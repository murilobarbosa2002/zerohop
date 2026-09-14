import { BrowserWindow } from 'electron';
import { getSettings } from '@main/settings';
import { appendLog } from '@main/logger';
import { HOTKEYS_STRINGS } from '@main/strings/hotkeys.strings';
import { HOTKEYS_INIT_TIMEOUT_MS } from '@main/constants/hotkeys';
import { IPC_CHANNELS } from '@shared/ipcChannels';
import { LogCategory, LogLevel } from '@shared/logEntry';
import type { HotkeyBinding } from '@shared/hotkeySettings';

type UiohookModule = typeof import('uiohook-napi');
type UiohookKeyboardEvent = import('uiohook-napi').UiohookKeyboardEvent;

let uiohookModule: UiohookModule | null = null;
let started = false;
let pttHeld = false;
let pttReleaseTimeout: ReturnType<typeof setTimeout> | null = null;
let recordingCallback: ((binding: HotkeyBinding) => void) | null = null;
let keyLabelByCode: Map<number, string> | null = null;

async function loadUiohook(): Promise<UiohookModule | null> {
  if (uiohookModule) return uiohookModule;
  try {
    uiohookModule = await import('uiohook-napi');
    return uiohookModule;
  } catch {
    return null;
  }
}

function getKeyLabel(keycode: number): string {
  if (!keyLabelByCode && uiohookModule) {
    keyLabelByCode = new Map(Object.entries(uiohookModule.UiohookKey).map(([name, code]) => [code, name]));
  }
  return keyLabelByCode?.get(keycode) ?? `Tecla #${keycode}`;
}

function sendToRenderers(channel: string, ...args: unknown[]): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(channel, ...args);
  }
}

function handleKeyDown(event: UiohookKeyboardEvent): void {
  if (recordingCallback) {
    const callback = recordingCallback;
    recordingCallback = null;
    callback({ keycode: event.keycode, label: getKeyLabel(event.keycode) });
    return;
  }

  const { hotkeys } = getSettings();
  if (hotkeys.pushToTalkHotkey && event.keycode === hotkeys.pushToTalkHotkey.keycode) {
    if (pttReleaseTimeout) {
      clearTimeout(pttReleaseTimeout);
      pttReleaseTimeout = null;
    }
    if (!pttHeld) {
      pttHeld = true;
      sendToRenderers(IPC_CHANNELS.hotkeyPttActiveChanged, true);
    }
  }
}

function handleKeyUp(event: UiohookKeyboardEvent): void {
  const { hotkeys } = getSettings();
  if (!hotkeys.pushToTalkHotkey || event.keycode !== hotkeys.pushToTalkHotkey.keycode || !pttHeld) return;
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

export function recordNextHotkey(callback: (binding: HotkeyBinding) => void): void {
  recordingCallback = callback;
}

export function cancelHotkeyRecording(): void {
  recordingCallback = null;
}
