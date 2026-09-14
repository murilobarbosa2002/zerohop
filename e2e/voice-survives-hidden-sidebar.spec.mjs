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
  await hostWin.waitForTimeout(1500);

  const audioCountBefore = await hostWin.locator('audio[autoplay]').count();
  check('host has at least one voice audio element before hiding the sidebar', audioCountBefore > 0);

  await hostWin.getByText('Ocultar sala', { exact: true }).click();
  await hostWin.waitForTimeout(500);

  check(
    'sidebar is actually hidden',
    !(await hostWin
      .getByText('Participantes', { exact: true })
      .isVisible()
      .catch(() => false))
  );

  const audioCountAfter = await hostWin.locator('audio[autoplay]').count();
  check('voice audio element(s) still present after hiding the sidebar (voice keeps playing)', audioCountAfter === audioCountBefore);

  await hostWin.getByText('Mostrar sala', { exact: true }).click();
  await hostWin.waitForTimeout(300);
  check('sidebar shows again', await hostWin.getByText('Participantes', { exact: true }).isVisible());
} finally {
  await host.close();
  await guest.close();
}

finish();
