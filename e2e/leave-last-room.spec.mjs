import { launchApp } from './helpers/launchApp.mjs';
import { createChecker } from './helpers/assert.mjs';
import { createRoom } from './helpers/room.mjs';

const { check, finish } = createChecker();

const host = await launchApp();

try {
  const win = await host.firstWindow();
  await win.waitForTimeout(800);

  await createRoom(win);
  await win.getByText('Sair da sala', { exact: true }).click();
  await win.waitForTimeout(1000);

  check('app does not crash after leaving the only room', !(await win.getByText('Algo deu errado').isVisible()));
  check('back at the pre-room choice screen', await win.getByText('Criar sala nova', { exact: true }).isVisible());
} finally {
  await host.close();
}

finish();
