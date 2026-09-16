import { _electron as electron } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

export async function launchApp() {
  const userDataDir = mkdtempSync(path.join(tmpdir(), 'zerohop-e2e-'));
  return electron.launch({
    args: [
      path.join(projectRoot, 'out/main/index.js'),
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      `--user-data-dir=${userDataDir}`
    ],
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '' }
  });
}
