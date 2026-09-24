import { launchApp } from './helpers/launchApp.mjs';
import { createChecker } from './helpers/assert.mjs';
import { configureProfile } from './helpers/room.mjs';

const { check, finish } = createChecker();

const hostApp = await launchApp();
const calleeApp = await launchApp();

try {
  const hostWin = await hostApp.firstWindow();
  const calleeWin = await calleeApp.firstWindow();
  await hostWin.waitForTimeout(800);
  await calleeWin.waitForTimeout(800);

  await configureProfile(hostWin, 'Host');
  const hostPersonalId = (await hostWin.locator('span.font-mono.font-bold.tracking-wide.text-accent').first().innerText()).trim();

  await configureProfile(calleeWin, 'Callee');

  await calleeWin.getByRole('button', { name: 'Configurações' }).first().click();
  await calleeWin.getByRole('button', { name: 'Sala pessoal e convites' }).click();
  await calleeWin.getByPlaceholder('Escolha uma senha pra proteger sua sala pessoal').fill('senha123');
  await calleeWin.getByText('← Voltar', { exact: true }).click();
  await calleeWin.waitForTimeout(300);
  const calleePersonalId = (await calleeWin.locator('span.font-mono.font-bold.tracking-wide.text-accent').first().innerText()).trim();

  await calleeWin.getByText('Contatos', { exact: true }).click();
  await calleeWin.getByPlaceholder('Como você quer chamar essa pessoa').fill('Amigo dono da sala');
  await calleeWin.getByPlaceholder('Peça pra ela copiar o "Seu ID" e colar aqui').fill(hostPersonalId);
  await calleeWin.getByPlaceholder('Peça pra ela te passar a senha da sala pessoal dela').fill('qualquercoisa');
  await calleeWin.getByRole('button', { name: 'Salvar contato' }).click();
  await calleeWin.waitForTimeout(300);
  await calleeWin.getByText('Voltar', { exact: true }).click();
  await calleeWin.waitForTimeout(300);

  await hostWin.getByText('Contatos', { exact: true }).click();
  await hostWin.getByPlaceholder('Como você quer chamar essa pessoa').fill('Amiga convidada');
  await hostWin.getByPlaceholder('Peça pra ela copiar o "Seu ID" e colar aqui').fill(calleePersonalId);
  await hostWin.getByPlaceholder('Peça pra ela te passar a senha da sala pessoal dela').fill('senha123');
  await hostWin.getByRole('button', { name: 'Salvar contato' }).click();
  await hostWin.waitForTimeout(300);

  await calleeWin.getByRole('button', { name: 'Abrir minha sala pessoal' }).click();
  await calleeWin.waitForTimeout(1500);

  await hostWin.getByText('Voltar', { exact: true }).click();
  await hostWin.getByRole('button', { name: 'Criar sala nova' }).click();
  await hostWin.getByPlaceholder('Como seus amigos vão te ver').fill('Host');
  await hostWin.getByPlaceholder('Escolha uma senha pra proteger a sala').fill('senha456');
  check('invite contacts section shows the saved contact', await hostWin.getByText('Amiga convidada', { exact: true }).isVisible());
  await hostWin.getByText('Amiga convidada', { exact: true }).click();
  await hostWin.getByRole('button', { name: 'Criar sala nova' }).click();
  await hostWin.waitForTimeout(1500);

  check('callee received an invite prompt', await calleeWin.getByText('Host te convidou pra uma sala', { exact: true }).isVisible());
  await calleeWin.getByRole('button', { name: 'Entrar' }).click();
  await calleeWin.waitForTimeout(1500);

  check(
    'callee auto-joined without a manual approval prompt on the host side',
    !(await hostWin.getByText('Aceitar', { exact: true }).isVisible())
  );
  check('callee entered the host room', await calleeWin.getByText('Código da sala:').isVisible());
  check(
    'host sees the callee in the participant list, using the saved contact nickname',
    await hostWin.getByText('Amiga convidada', { exact: true }).isVisible()
  );
} finally {
  await hostApp.close();
  await calleeApp.close();
}

finish();
