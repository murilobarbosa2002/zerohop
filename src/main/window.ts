import { BrowserWindow } from 'electron';
import { join } from 'path';
import {
  WINDOW_DEFAULT_WIDTH,
  WINDOW_DEFAULT_HEIGHT,
  WINDOW_MIN_WIDTH,
  WINDOW_MIN_HEIGHT,
  WINDOW_BACKGROUND_COLOR
} from '@main/constants/window';
import { APP_ICON_RELATIVE_PATH, PRELOAD_SCRIPT_RELATIVE_PATH, RENDERER_HTML_RELATIVE_PATH } from '@main/constants/paths';
import { DEVTOOLS_KEYDOWN_EVENT_TYPE, DEVTOOLS_SHORTCUT_KEY, DEVTOOLS_SHORTCUT_MODIFIER_KEY } from '@main/constants/devtools';

let mainWindow: BrowserWindow | null = null;

export function createWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: WINDOW_DEFAULT_WIDTH,
    height: WINDOW_DEFAULT_HEIGHT,
    minWidth: WINDOW_MIN_WIDTH,
    minHeight: WINDOW_MIN_HEIGHT,
    backgroundColor: WINDOW_BACKGROUND_COLOR,
    icon: join(__dirname, APP_ICON_RELATIVE_PATH),
    frame: false,
    webPreferences: {
      preload: join(__dirname, PRELOAD_SCRIPT_RELATIVE_PATH),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, RENDERER_HTML_RELATIVE_PATH));
  }

  mainWindow.webContents.on('before-input-event', (_event, input) => {
    if (input.type !== DEVTOOLS_KEYDOWN_EVENT_TYPE) return;
    const isDevToolsShortcut =
      input.key === DEVTOOLS_SHORTCUT_KEY ||
      (input.control && input.shift && input.key.toUpperCase() === DEVTOOLS_SHORTCUT_MODIFIER_KEY);
    if (isDevToolsShortcut) mainWindow?.webContents.toggleDevTools();
  });

  return mainWindow;
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}
