import { launchApp } from './helpers/launchApp.mjs';
import { createChecker } from './helpers/assert.mjs';
import { createRoom, joinRoom, approveJoinRequest } from './helpers/room.mjs';

const { check, finish } = createChecker();

const host = await launchApp();
const guestA = await launchApp();
const guestB = await launchApp();

try {
  const hostWin = await host.firstWindow();
  const guestAWin = await guestA.firstWindow();
  const guestBWin = await guestB.firstWindow();
  await hostWin.waitForTimeout(800);
  await guestAWin.waitForTimeout(800);
  await guestBWin.waitForTimeout(800);

  const roomCode = await createRoom(hostWin);

  await joinRoom(guestAWin, roomCode, { name: 'GuestA' });
  await approveJoinRequest(hostWin);
  await guestAWin.waitForTimeout(1000);

  await joinRoom(guestBWin, roomCode, { name: 'GuestB' });
  await approveJoinRequest(hostWin);
  await guestBWin.waitForTimeout(2500);

  check('host sees GuestA', await hostWin.getByText('GuestA', { exact: true }).isVisible());
  check('host sees GuestB', await hostWin.getByText('GuestB', { exact: true }).isVisible());
  check('GuestA sees GuestB directly (mesh connection, not just host)', await guestAWin.getByText('GuestB', { exact: true }).isVisible());
  check('GuestB sees GuestA directly (mesh connection, not just host)', await guestBWin.getByText('GuestA', { exact: true }).isVisible());
} finally {
  await host.close();
  await guestA.close();
  await guestB.close();
}

finish();
