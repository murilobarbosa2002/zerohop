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
  await guestWin.waitForTimeout(1500);
  await hostWin.waitForTimeout(1500);

  await hostWin.getByRole('button', { name: 'Mutar mic' }).click({ timeout: 5000 });
  await hostWin.waitForTimeout(1000);
  await guestWin.waitForTimeout(1000);

  check('guest sees the mic-muted indicator next to the host name', await guestWin.getByLabel('microfone mutado').first().isVisible());
} finally {
  await host.close();
  await guest.close();
}

finish();
