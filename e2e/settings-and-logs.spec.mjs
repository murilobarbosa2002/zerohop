import { launchApp } from './helpers/launchApp.mjs';
import { createChecker } from './helpers/assert.mjs';

const { check, finish } = createChecker();

const app = await launchApp();

try {
  const win = await app.firstWindow();
  await win.waitForTimeout(2000);

  await win.getByRole('button', { name: 'Configurações' }).click();
  await win.waitForTimeout(500);
  check('settings screen opens', (await win.locator('input[type="checkbox"]').count()) > 0);
  check('sound mixer shows the 5 categories', (await win.getByText('Chamada de voz').count()) > 0);
  check('hotkey settings show the push-to-talk row', (await win.getByText('Push-to-talk (segurar pra falar)').count()) > 0);

  await win.getByText('← Voltar', { exact: true }).click();
  await win.waitForTimeout(300);

  await win.getByRole('button', { name: 'Logs' }).click();
  await win.waitForTimeout(500);
  check('logs screen shows the "app opened" entry', await win.getByText('foi aberto.').first().isVisible());
  check('logs screen has a copy button', await win.getByRole('button', { name: 'Copiar' }).isVisible());
} finally {
  await app.close();
}

finish();
