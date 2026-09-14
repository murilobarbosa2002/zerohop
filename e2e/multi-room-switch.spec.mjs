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

  const roomA = await createRoom(hostWin, { name: 'Host' });
  await joinRoom(guestWin, roomA, { name: 'Guest' });
  await approveJoinRequest(hostWin);
  await guestWin.waitForTimeout(800);

  check('host mutes mic in room A', true);
  await hostWin.getByRole('button', { name: 'Mutar mic' }).click();
  await hostWin.waitForTimeout(200);
  check('mic shows as muted in room A', await hostWin.getByRole('button', { name: 'Ativar mic' }).isVisible());

  await hostWin.getByTitle('+ Nova sala').click();
  await hostWin.waitForTimeout(300);
  const roomB = await createRoom(hostWin, { name: 'Host' });
  await hostWin.waitForTimeout(500);

  check('room A tab still visible after creating room B', await hostWin.getByTitle(roomA).isVisible());
  check('room B is now focused', await hostWin.getByText(roomB, { exact: true }).isVisible());

  await guestWin.getByPlaceholder('Escreva uma mensagem...').fill('mensagem enquanto host esta na sala B');
  await guestWin.getByRole('button', { name: 'Enviar' }).click();
  await hostWin.waitForTimeout(600);

  const roomATab = hostWin.getByTitle(roomA);
  const unreadBadgeVisible = await roomATab
    .locator('xpath=..')
    .getByText(/^[1-9]/)
    .first()
    .isVisible()
    .catch(() => false);
  check('unread badge appears on room A tab while focused on room B', unreadBadgeVisible);

  await roomATab.click();
  await hostWin.waitForTimeout(400);

  check('switching back to room A shows the guest message', await hostWin.getByText('mensagem enquanto host esta na sala B').isVisible());
  check('mic mute state persisted after switching away and back', await hostWin.getByRole('button', { name: 'Ativar mic' }).isVisible());
} finally {
  await host.close();
  await guest.close();
}

finish();
