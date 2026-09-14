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
  await hostWin.waitForTimeout(1000);

  await hostWin.getByRole('button', { name: 'Configurações' }).first().click();
  await hostWin.waitForTimeout(500);
  check('settings screen opens over the room', await hostWin.getByText('Dispositivo de saída de áudio').isVisible());

  await hostWin.getByRole('button', { name: 'Logs' }).first().click();
  await hostWin.waitForTimeout(500);
  check(
    'clicking Logs while Settings is open switches directly to Logs (no need to click back first)',
    await hostWin.locator('text=/foi aberto\\./').first().isVisible()
  );

  await hostWin.getByText('← Voltar', { exact: true }).click();
  await hostWin.waitForTimeout(500);
  check(
    'room (with active sharing) is still there after visiting Settings/Logs',
    await hostWin.getByText('Você está compartilhando sua tela.').isVisible()
  );

  const hasSrcObject = await hostWin.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.srcObject !== null : false;
  });
  check('self-preview keeps its stream attached across overlay navigation (not reset to black)', hasSrcObject);
} finally {
  await host.close();
  await guest.close();
}

finish();
