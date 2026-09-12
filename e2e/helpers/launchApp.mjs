import { _electron as electron } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

export async function launchApp() {
  return electron.launch({
    args: [path.join(projectRoot, 'out/main/index.js'), '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '' }
  });
}
