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
  check('room code captured', roomCode.length > 0);

  await joinRoom(guestWin, roomCode);
  await approveJoinRequest(hostWin);
  await guestWin.waitForTimeout(1000);

  check('guest sees room code after joining', await guestWin.getByText('Código da sala:').isVisible());
  check('host sees the guest in the participant list', await hostWin.getByText('Guest', { exact: true }).isVisible());
} finally {
  await host.close();
  await guest.close();
}

finish();
