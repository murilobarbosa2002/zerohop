import { launchApp } from './helpers/launchApp.mjs';
import { createChecker } from './helpers/assert.mjs';
import { joinRoom, approveJoinRequest, configureProfile } from './helpers/room.mjs';

const { check, finish } = createChecker();

const host = await launchApp();
const guest = await launchApp();

try {
  const hostWin = await host.firstWindow();
  const guestWin = await guest.firstWindow();
  await hostWin.waitForTimeout(800);
  await guestWin.waitForTimeout(800);

  await configureProfile(hostWin, 'Host');
  await hostWin.getByText('Criar sala nova', { exact: true }).click();
  await hostWin.waitForTimeout(300);

  const avatarContainer = hostWin.locator('text=Foto de perfil').locator('xpath=following-sibling::div[1]');
  check('avatar picker shows 8 options', (await avatarContainer.locator('button').count()) === 8);
  await avatarContainer.locator('button').nth(1).click();
  await hostWin.waitForTimeout(200);

  await hostWin.getByPlaceholder('Como seus amigos vão te ver').fill('Host');
  await hostWin.getByPlaceholder('Escolha uma senha pra proteger a sala').fill('senha123');
  await hostWin.getByRole('button', { name: 'Criar sala nova' }).click();
  await hostWin.waitForTimeout(1000);
  const roomCode = (await hostWin.locator('span.font-mono.font-bold.tracking-wide.text-accent').first().innerText()).trim();
  check('room created after picking an avatar (no accidental form submit/reload)', roomCode.length > 0);

  await joinRoom(guestWin, roomCode, { name: 'Guest' });
  await approveJoinRequest(hostWin);
  await guestWin.waitForTimeout(800);

  const starGlyphCount = await guestWin.locator('svg path[d*="L14.6 9"]').count();
  check('guest sees the star avatar glyph (the one host picked) for the host', starGlyphCount > 0);
} finally {
  await host.close();
  await guest.close();
}

finish();
