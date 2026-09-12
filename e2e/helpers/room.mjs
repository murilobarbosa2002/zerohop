export async function createRoom(hostWin, { name = 'Host', password = 'senha123' } = {}) {
  await hostWin.getByText('Criar sala nova', { exact: true }).click();
  await hostWin.getByPlaceholder('Como seus amigos vão te ver').fill(name);
  await hostWin.getByPlaceholder('Escolha uma senha pra proteger a sala').fill(password);
  await hostWin.getByRole('button', { name: 'Criar sala nova' }).click();
  await hostWin.waitForTimeout(1500);
  return (await hostWin.locator('span.font-mono.font-bold.tracking-wide.text-accent').first().innerText()).trim();
}

export async function joinRoom(guestWin, roomCode, { name = 'Guest', password = 'senha123' } = {}) {
  await guestWin.getByText('Entrar numa sala', { exact: true }).click();
  await guestWin.getByPlaceholder('Como seus amigos vão te ver').fill(name);
  await guestWin.getByPlaceholder('Cole aqui o código que seu amigo te mandou').fill(roomCode);
  await guestWin.getByPlaceholder('Digite a senha que seu amigo te passou').fill(password);
  await guestWin.getByRole('button', { name: 'Entrar numa sala' }).click();
  await guestWin.waitForTimeout(1500);
}

export async function approveJoinRequest(hostWin) {
  await hostWin.getByText('Aceitar', { exact: true }).click({ timeout: 5000 }).catch(() => {});
  await hostWin.waitForTimeout(1000);
}
