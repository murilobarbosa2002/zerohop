# Rodando, editando e mantendo o projeto

**Resumo em uma frase:** clone, `npm install`, `npm run dev` — e antes de qualquer contribuição, leia esta página até o fim, porque ela é a checklist real que toda mudança precisa passar.

> Esta página é sobre **código**. Se você só quer usar o app, veja [Como usar](/guia/como-usar). Se quer entender a arquitetura antes, veja [Arquitetura](/tecnico/arquitetura) e o [Mapa do código](/tecnico/mapa-do-codigo).

## Rodando localmente

```bash
git clone https://github.com/murilobarbosa2002/zerohop.git
cd zerohop
npm install
npm run dev
```

`npm run dev` sobe o `electron-vite` em modo desenvolvimento: hot-reload no `renderer`, o processo principal reinicia sozinho quando você edita algo em `src/main/`.

| Comando                | O que faz                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Ambiente de desenvolvimento, com hot-reload.                                                                                                      |
| `npm run build`        | Gera o bundle de produção em `out/` (Vite). É o que o `electron-builder` empacota depois.                                                         |
| `npm run typecheck`    | `tsc -b --noEmit` nos três projetos TypeScript (`main`, `preload`/`renderer` web). Roda no CI a cada push/PR.                                     |
| `npm run test:e2e`     | Builda e roda a suíte de ponta a ponta (ver [Testes](#testes)).                                                                                   |
| `npm run lint:md`      | Markdownlint em todo `.md` do repositório (inclusive esta documentação).                                                                          |
| `npm run lint`         | ESLint (regras de qualidade — variável não usada, etc.). Cobre por enquanto só `.js`/`.mjs` (ver observação abaixo sobre `.ts`/`.tsx`).           |
| `npm run format`       | Formata o projeto inteiro com Prettier (espaço, aspas, quebra de linha).                                                                          |
| `npm run format:check` | Confere se está tudo formatado, sem alterar nada — é o que o CI roda.                                                                             |
| `npm run dist:local`   | Gera uma pasta portátil (`target: dir`) sem passar pelo instalador — só pra testar rápido no Windows/WSL. **Não é** o caminho de release oficial. |

> **`.ts`/`.tsx` ainda não passam pelo ESLint.** O projeto usa a versão mais recente do TypeScript (7.x), e a ferramenta que faz o ESLint entender TypeScript (`typescript-eslint`) ainda não dá suporte a essa versão — nem a build mais recente dela. Enquanto isso, arquivos `.ts`/`.tsx` são formatados pelo Prettier normalmente e continuam com a checagem de tipos de sempre (`npm run typecheck`), só não passam pelas regras de qualidade do ESLint. Assim que `typescript-eslint` publicar suporte ao TypeScript 7, vale estender o `eslint.config.mjs` pra cobrir esses arquivos também.

## Testes

A suíte de ponta a ponta (`e2e/`) usa [Playwright](https://playwright.dev/) contra o binário real do Electron (`node_modules/electron/dist/electron`), abrindo múltiplas instâncias do app pra simular pessoas de verdade numa sala. Roda com:

```bash
npm run build
ELECTRON_RUN_AS_NODE= xvfb-run -a node e2e/run-all.mjs
```

(`xvfb-run` só é necessário em Linux sem display gráfico — no Windows/macOS com interface, `node e2e/run-all.mjs` sozinho já funciona.)

Cada arquivo em `e2e/*.spec.mjs` é um cenário independente. `e2e/helpers/launchApp.mjs` centraliza como o Electron é iniciado nos testes (com `--use-fake-device-for-media-stream` pra simular câmera/microfone sem hardware real). **Toda mudança de comportamento visível precisa de um teste novo ou atualizado** — é assim que regressões como "a voz para de tocar ao ocultar a sala" ou "a malha quebra com 3+ pessoas" não voltam a acontecer.

## Como adicionar coisas comuns

### Um som novo

1. Sintetizar o `.wav` (tom senoidal/triangular/quadrado/dente-de-serra com envelope de ataque/liberação — os scripts usados historicamente ficam fora do repositório, mas qualquer gerador simples em Python com o módulo `wave` funciona) e salvar em `src/renderer/src/assets/sounds/`.
2. Importar o arquivo e exportar uma função `playXSound()` em `src/renderer/src/services/soundEffects.ts`, associada a uma `SoundCategory` (`constants/soundEffects.ts`).
3. Chamar `playXSound()` no componente/hook onde a ação acontece.
4. **Antes de tudo isso**, conferir se a ação já não tem som (procurar em `soundEffects.ts`) — nunca reaproveitar um som existente pra uma ação com significado diferente (ver [Sistema de sons](/tecnico/mapa-do-codigo#sistema-de-sons)).

### Uma preferência nova (configurável em Configurações)

- Se só o `renderer` precisa saber o valor (a maioria dos casos): siga o padrão de `services/soundEffectsPreference.ts` — `get`/`set`/`subscribe` sobre `localStorage`, com um hook `useX.ts` usando `useSyncExternalStore` por cima.
- Se o `main` também precisa saber (ex: um atalho de teclado, uma flag que muda o comportamento do Chromium): a preferência vai em `settings.json`, editando `main/settings.ts`, e precisa de um canal de IPC pro `renderer` ler/escrever (ver [Um canal de IPC novo](#um-canal-de-ipc-novo)).

### Um canal de IPC novo

1. Declarar o nome do canal em `src/shared/ipcChannels.ts`.
2. Registrar o handler (`ipcMain.handle` pra requisição/resposta, `ipcMain.on` pra fire-and-forget) em `src/main/ipc.ts`.
3. Expor a função correspondente em `src/preload/index.ts`.
4. Declarar a assinatura em `src/renderer/src/global.d.ts` (`interface Window.api`) — esse arquivo é escrito à mão, não é gerado automaticamente a partir do `preload`.

### Uma dependência nativa nova (`.node`)

Regra sem exceção: **nunca `import`/`require` estático no topo de um arquivo do processo principal.** Um módulo nativo ausente (biblioteca do sistema faltando, arquitetura incompatível) derruba o processo inteiro na inicialização se for importado de forma estática, mesmo que a feature seja opt-in. Sempre:

```ts
async function loadMinhaLibNativa() {
  try {
    return await import('minha-lib-nativa');
  } catch {
    return null;
  }
}
```

...chamado só de dentro da função que realmente usa a lib, nunca no topo do arquivo. Além disso, a dependência precisa entrar em `build.asarUnpack` no `package.json` (senão o `.node` compilado fica preso dentro do `app.asar` e não carrega no app empacotado). Exemplos reais no projeto: `loopback-capture`, `node-window-manager`, `uiohook-napi`.

## Processo de release

O instalador Windows **nunca** é compilado localmente — é gerado do zero por um workflow do GitHub Actions rodando numa máquina Windows real, disparado a cada tag `vX.Y.Z` publicada.

Checklist completa antes de marcar uma tag:

1. Bump de versão em `package.json` (`version`) e no `console.log` de `src/renderer/src/main.tsx` (facilita confirmar qual build está rodando, visível na barra de título/tela de Logs sem precisar de DevTools).
2. Escrever `docs/releases/vX.Y.Z.md` (o formato de todas as versões anteriores é o padrão a seguir) e adicionar uma linha em `CHANGELOG.md`.
3. Atualizar a página correspondente em `docs-site/` (guia de uso, ou esta seção técnica, dependendo da mudança) — nunca deixar pra depois.
4. `npm run typecheck && npm run build && npm run lint && npm run format:check && npm run lint:md` limpos.
5. `npm run test:e2e` passando (suíte inteira).
6. `npm install --package-lock-only` pra sincronizar o `package-lock.json` com a nova versão — **precisa bater antes de marcar a tag**.
7. Commit, `git tag vX.Y.Z`, `git push origin main --tags`.
8. O workflow `.github/workflows/release.yml` builda e publica um rascunho de release no GitHub; ele precisa ser revisado e publicado manualmente (ou via automação de quem mantém o repositório) depois que o build terminar com sucesso.

## Convenções de código

As regras detalhadas de estilo, arquitetura de componentes React, nomenclatura e formato de commits ficam fora desta documentação pública (são um arquivo de instruções interno do repositório, não pensado pra leitura externa). Os princípios gerais que valem a pena saber como contribuidor externo:

- **Zero duplicação de código.** A mesma lógica em dois lugares vira função/hook/componente compartilhado.
- **TypeScript estrito em todo o projeto**, sem `any` — tipo genuinamente desconhecido vira `unknown` e é refinado.
- **Sem comentários no código.** Nomes de variáveis/funções/componentes precisam ser autoexplicativos; se algo precisa de explicação, o código deveria estar mais claro, não ganhar um comentário.
- **Toda string visível ao usuário** (texto de botão, mensagem de erro, label) vive num arquivo `strings/*.ts` dedicado, nunca solta dentro do JSX.
- **`services/` nunca importa de `components/` ou `hooks/`** — a dependência é sempre uma via, `components → hooks → services`.
