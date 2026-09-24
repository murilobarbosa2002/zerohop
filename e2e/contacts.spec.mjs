import { launchApp } from './helpers/launchApp.mjs';
import { createChecker } from './helpers/assert.mjs';
import { approveJoinRequest } from './helpers/room.mjs';

const { check, finish } = createChecker();

const hostApp = await launchApp();
const callerApp = await launchApp();

try {
  const hostWin = await hostApp.firstWindow();
  const callerWin = await callerApp.firstWindow();
  await hostWin.waitForTimeout(800);
  await callerWin.waitForTimeout(800);

  await hostWin.getByText('Contatos', { exact: true }).click();
  await hostWin.getByPlaceholder('Como seus amigos vão te ver').fill('Host');
  await hostWin.getByText('Voltar', { exact: true }).click();
  await hostWin.waitForTimeout(300);

  const hostPersonalId = (await hostWin.locator('span.font-mono.font-bold.tracking-wide.text-accent').first().innerText()).trim();
  check('personal id is generated', hostPersonalId.length > 0);

  await hostWin.getByRole('button', { name: 'Configurações' }).first().click();
  await hostWin.getByRole('button', { name: 'Sala pessoal e convites' }).click();
  await hostWin.getByPlaceholder('Escolha uma senha pra proteger sua sala pessoal').fill('senha123');
  await hostWin.getByText('← Voltar', { exact: true }).click();
  await hostWin.waitForTimeout(300);

  await hostWin.getByRole('button', { name: 'Abrir minha sala pessoal' }).click();
  await hostWin.waitForTimeout(1500);

  await callerWin.getByText('Contatos', { exact: true }).click();
  await callerWin.getByPlaceholder('Como seus amigos vão te ver').fill('Caller');
  await callerWin.getByPlaceholder('Como você quer chamar essa pessoa').fill('Meu amigo');
  await callerWin.getByPlaceholder('Peça pra ela copiar o "Seu ID" e colar aqui').fill(hostPersonalId);
  await callerWin.getByPlaceholder('Peça pra ela te passar a senha da sala pessoal dela').fill('senha123');
  await callerWin.getByRole('button', { name: 'Salvar contato' }).click();
  await callerWin.waitForTimeout(300);

  check('saved contact appears in the list', await callerWin.getByText('Meu amigo', { exact: true }).first().isVisible());

  await callerWin.getByRole('button', { name: 'Chamar' }).click();
  await approveJoinRequest(hostWin);
  await callerWin.waitForTimeout(1500);

  check('caller entered the host personal room', await callerWin.getByText('Código da sala:').isVisible());
  check('host sees the caller in the participant list', await hostWin.getByText('Caller', { exact: true }).isVisible());
} finally {
  await hostApp.close();
  await callerApp.close();
}

finish();
