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

  await guestWin.getByPlaceholder('Escreva uma mensagem...').fill('mensagem do convidado');
  await guestWin.getByRole('button', { name: 'Enviar' }).click();
  await hostWin.waitForTimeout(500);

  check('host recebeu a mensagem do convidado', await hostWin.getByText('mensagem do convidado').isVisible());

  await hostWin.getByRole('button', { name: 'Apagar mensagem' }).first().click();
  await hostWin.waitForTimeout(200);
  check('confirmacao de exclusao aparece antes de apagar de verdade', await hostWin.getByText('Apagar essa mensagem?').isVisible());
  await hostWin.getByRole('button', { name: 'Apagar', exact: true }).click();
  await guestWin.waitForTimeout(500);

  check('mensagem sumiu no host (dono da sala apagou)', !(await hostWin.getByText('mensagem do convidado').isVisible().catch(() => false)));
  check('mensagem sumiu tambem no convidado (apagado em toda a sala)', !(await guestWin.getByText('mensagem do convidado').isVisible().catch(() => false)));
} finally {
  await host.close();
  await guest.close();
}

finish();
