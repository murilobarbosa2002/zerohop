import { launchApp } from './helpers/launchApp.mjs';
import { createChecker } from './helpers/assert.mjs';
import { createRoom, joinRoom, approveJoinRequest } from './helpers/room.mjs';

const { check, finish } = createChecker();

const host = await launchApp();
const guest = await launchApp();

try {
  const hostWin = await host.firstWindow();
  const guestWin = await guest.firstWindow();
  await hostWin.waitForTimeout(800);
  await guestWin.waitForTimeout(800);

  const roomCode = await createRoom(hostWin);
  await joinRoom(guestWin, roomCode);
  await approveJoinRequest(hostWin);
  await guestWin.waitForTimeout(1000);

  await hostWin.getByText('Compartilhar minha tela', { exact: true }).click();
  await hostWin.waitForTimeout(300);
  await hostWin.getByText('Tela inteira', { exact: true }).click();
  await hostWin.waitForTimeout(500);
  await hostWin
    .locator('button img, button video')
    .first()
    .click()
    .catch(() => {});
  await hostWin.waitForTimeout(300);
  await hostWin.getByRole('button', { name: 'Compartilhar minha tela' }).click();
  await hostWin.waitForTimeout(1500);

  check('host shows active sharing status', await hostWin.getByText('Você está compartilhando sua tela.').isVisible());

  await guestWin
    .getByRole('button', { name: 'Assistir' })
    .click({ timeout: 5000 })
    .catch(() => {});
  await guestWin.waitForTimeout(1500);
  const guestVideoBefore = await guestWin.locator('video').count();
  check('guest has at least one video element', guestVideoBefore > 0);

  await hostWin.getByRole('button', { name: 'Editar' }).click();
  await hostWin.waitForTimeout(500);
  await hostWin
    .getByText('Tela inteira', { exact: true })
    .click()
    .catch(() => {});
  await hostWin.waitForTimeout(300);
  await hostWin
    .locator('button img, button video')
    .first()
    .click()
    .catch(() => {});
  await hostWin.waitForTimeout(300);
  check(
    'picker shows "save changes" while editing during a live share',
    await hostWin.getByText('Salvar alterações', { exact: true }).isVisible()
  );
  await hostWin.getByRole('button', { name: 'Salvar alterações' }).click();
  await hostWin.waitForTimeout(1500);

  check('host still sharing after editing (no stop/restart)', await hostWin.getByText('Você está compartilhando sua tela.').isVisible());
  const guestVideoAfter = await guestWin.locator('video').count();
  check('guest keeps the same video connection after the edit', guestVideoAfter === guestVideoBefore && guestVideoAfter > 0);

  await hostWin.getByRole('button', { name: 'Parar de compartilhar' }).click();
  await hostWin.waitForTimeout(500);
  check('host stops sharing cleanly', !(await hostWin.getByText('Você está compartilhando sua tela.').isVisible()));
} finally {
  await host.close();
  await guest.close();
}

finish();
