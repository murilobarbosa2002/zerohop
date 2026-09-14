# Mapa do código

**Resumo em uma frase:** três camadas fixas (`main`, `preload`, `renderer`), e dentro do `renderer` uma separação estrita entre lógica (`services/`), ponte com o React (`hooks/`) e interface (`components/`).

Esta página existe pra alguém abrir o repositório pela primeira vez e achar rápido "onde mexo pra fazer X" — não é uma lista exaustiva de todo arquivo, é um mapa de responsabilidades.

## As três camadas do Electron

```text
src/
  main/       processo principal (Node.js puro, sem DOM) — janela, IPC, updater, settings.json, logs
  preload/    ponte contextBridge — o ÚNICO jeito do renderer falar com o main
  renderer/   processo de UI (Chromium) — React + TypeScript + Tailwind
  shared/     tipos e constantes usados dos dois lados (main E renderer), sem lógica de nenhum dos dois
```

**Por que essa separação existe:** o `renderer` roda com `contextIsolation: true` e `nodeIntegration: false` — ele não tem acesso a Node.js, sistema de arquivos ou APIs do Electron diretamente. Tudo que o `renderer` precisa do sistema operacional (abrir/fechar janela, ler/escrever `settings.json`, capturar teclado global, etc.) passa por uma função exposta no `preload/index.ts` via `contextBridge.exposeInMainWorld('api', ...)`, que internamente chama `ipcRenderer.invoke`/`.send` pro `main` processar. Ver **Segurança do processo principal** mais abaixo.

## `src/main/` — processo principal

| Arquivo            | Responsabilidade                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.ts`         | Ponto de entrada. Configura flags do Chromium, lê `settings.json`, cria a janela, registra os handlers de IPC, inicia o updater e a captura global de teclado.                                                     |
| `window.ts`        | Cria a `BrowserWindow` (sem moldura nativa — a barra de título é toda customizada em React) e intercepta o evento `close` pra dar tempo do som de fechar tocar antes da janela morrer de verdade.                  |
| `ipc.ts`           | Todos os handlers `ipcMain.handle`/`ipcMain.on` num só lugar — é o "menu" completo de tudo que o renderer pode pedir pro main fazer.                                                                               |
| `settings.ts`      | Lê/escreve `settings.json` (fica em `app.getPath('userData')`) — auto-update, atalhos de teclado, flags experimentais. Isso é diferente do `localStorage` do renderer (ver **Onde cada preferência mora** abaixo). |
| `globalHotkeys.ts` | Captura de teclado em nível de sistema via `uiohook-napi` (dependência nativa) — mutar mic, mutar áudio e push-to-talk funcionando mesmo com outro programa em foco.                                               |
| `audioLoopback.ts` | Áudio isolado por aplicativo (WASAPI Process Loopback) via `loopback-capture` + `node-window-manager` — dependência nativa, opt-in.                                                                                |
| `updater.ts`       | `electron-updater`: verifica, baixa e instala atualizações via GitHub Releases.                                                                                                                                    |
| `logger.ts`        | Lê/escreve o histórico de logs (`logs.jsonl`), consumido pela tela de Logs do app.                                                                                                                                 |
| `constants/`       | Uma constante nomeada por arquivo/tema (nunca valor solto no meio do código) — janela, captura, logging, atualização, etc.                                                                                         |
| `strings/`         | Strings visíveis ao usuário que se originam no processo principal (ex: aviso de captura experimental, mensagens de log de teclas de atalho).                                                                       |

## `src/preload/index.ts` — a ponte

Um único arquivo. Cada função exposta em `window.api` corresponde a um canal de IPC declarado em `src/shared/ipcChannels.ts`. Se você precisa que o renderer converse com o sistema operacional de um jeito novo, o fluxo é sempre:

1. Adicionar o canal em `shared/ipcChannels.ts`.
2. Registrar o handler em `main/ipc.ts` (ou noutro arquivo do `main/`, chamado a partir dali).
3. Expor a função em `preload/index.ts`.
4. Declarar o tipo dela em `renderer/src/global.d.ts` (a interface `Window.api` é escrita à mão, não gerada — ver nota abaixo).

> **Nota:** `global.d.ts` não deriva automaticamente do `preload/index.ts` — são dois lugares que precisam ficar em sincronia manualmente. Esquecer o passo 4 dá erro de TypeScript só na hora de compilar o `renderer`, não o `preload`.

## `src/renderer/src/services/` — lógica de negócio, sem DOM

Regra de ferro: **nada aqui importa de `components/` ou `hooks/`**. Serviços não sabem que o React existe. Eles expõem estado e eventos através de `EventTarget`/`CustomEvent` — um padrão framework-agnostic de propósito, pra sobreviver a qualquer troca futura de UI.

- **`RoomClient.ts`** — o orquestrador central de uma sala. Uma sala inteira (mesh P2P, chat, voz, compartilhamento) é uma instância desta classe. É totalmente autocontida (sem estado global/singleton), por isso o app consegue ter **várias salas abertas ao mesmo tempo**. Delega quase tudo pros sub-serviços de `services/room/`.
- **`services/room/`** — os sub-serviços que o `RoomClient` orquestra:
  - `PeerConnectionManager` — ciclo de vida das conexões WebRTC (abrir, aceitar, fechar, reconectar), distingue chamadas de vídeo e de voz.
  - `RoomAuthController` — aperto de mão inicial (`hello`), checagem de versão do app, aprovação manual de quem entra.
  - `RoomProtocol` — interpreta as mensagens do protocolo (apresentação, lista de membros, status de compartilhamento/microfone, pedidos de assistir, remoção, chat, exclusão de mensagem).
  - `MemberRegistry` — estado de quem está na sala, do ponto de vista de cada participante.
  - `MembershipGossip` — propaga a lista de membros pra malha inteira (protocolo de "fofoca").
  - `MediaSharing` — envia vídeo/áudio da tela só pra quem pediu pra assistir.
  - `VoiceChat` — chamada de voz broadcast entre todos os membros, com retry/timeout de conexão.
  - `ChatService` — histórico de chat em memória (nunca persistido), envio/recebimento/exclusão de mensagem.
  - `peerSession.ts`, `iceDiagnostics.ts`, `turnCredentials.ts`, `videoBitrate.ts` — utilidades de baixo nível (geração de código de sala, diagnóstico de ICE, config STUN-only, ajuste de bitrate de vídeo numa conexão já aberta).
- **`MicCapture.ts`** — captura o microfone via um grafo do Web Audio API (`MediaStreamSource → GainNode → MediaStreamAudioDestinationNode`), pra permitir ajustar sensibilidade e mutar **na origem** (zerando o gain), não só desativando a `track`.
- **`ScreenCapture.ts`** — captura de tela/janela via `desktopCapturer` do Electron.
- **`soundEffects.ts`** — todos os efeitos sonoros do app, um `playXSound()` por ação, cada um com sua categoria de volume (ver [Sistema de sons](#sistema-de-sons)).
- **`*Preference.ts`** (`soundEffectsPreference`, `uiScalePreference`, `micInputPreference`, `audioOutputPreference`, `avatarPreference`) — preferências do usuário guardadas no `localStorage` do renderer, cada uma com seu próprio `get`/`set`/`subscribe`.
- **`appLog.ts`** — grava eventos no histórico de logs a partir do renderer (chama o `main` via IPC).

## `src/renderer/src/hooks/` — a ponte entre `services/` e o React

Serviços expõem estado via `EventTarget`; hooks traduzem isso pra algo que o React entende, quase sempre com [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) — é o padrão usado em praticamente todo hook de preferência (`useSoundEffectsVolume`, `useUiScale`, `useMicInputDevice`, etc.) e de estado de sala (`useMembers`, `useSharing`, `useChatMessages`, `useMicMuted`).

`useRoomSessions.ts` é o hook mais importante do app: gerencia a lista de sessões de sala abertas ao mesmo tempo (cada uma com seu próprio `RoomClient`) e qual está em foco — ver **Múltiplas salas ao mesmo tempo** abaixo.

## `src/renderer/src/components/` — interface

Um componente por pasta quando tem subcomponentes próprios (ex: `Room/`, `SettingsScreen/`, `ShareControls/`), cada um com seu `.types.ts` e, quando tem variantes visuais, um `.variants.ts` usando [`tailwind-variants`](https://www.tailwind-variants.org/). `App.tsx` é a _composition root_ — o único lugar que decide o layout geral e qual overlay (Configurações, Logs, Atualizações, Adicionar sala) está ativo.

Árvore simplificada de quem renderiza quem, dentro de uma sala:

```text
App
 ├─ TitleBar (logo, versão, atalhos de janela)
 ├─ RoomSwitcher (lista de sessões abertas, se houver mais de uma)
 └─ Room (só a sessão em FOCO monta isto — as outras ficam só como dados)
     ├─ RoomToolbar (mic, áudio, logs, configurações)
     ├─ RoomSidebar (código/senha da sala, participantes)
     ├─ RoomStage (grade de vídeos sendo assistidos)
     ├─ ShareControls (iniciar/editar/parar compartilhamento)
     ├─ Chat
     ├─ VoiceAudioSinks (elementos <audio> de cada voz — sempre montados, independente da sidebar)
     └─ JoinRequestModal (se você for dono da sala)
```

## Onde cada preferência mora

Duas fontes de armazenamento persistente, cada uma por um motivo técnico específico:

| Preferência                                                                    | Onde fica                                | Por quê                                                                                                                                                                                             |
| ------------------------------------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Volume dos sons, escala da interface, dispositivo de mic/áudio, foto de perfil | `localStorage` do renderer               | São lidas/escritas só de dentro do processo de UI, não precisam existir fora dele.                                                                                                                  |
| Atalhos de teclado, flags experimentais, auto-update                           | `settings.json` (via `main/settings.ts`) | Só o processo principal consegue rodar a captura global de teclado (`uiohook-napi`) e decidir se ativa flags do Chromium — essas preferências **precisam** existir no `main`, não só no `renderer`. |

## Sistema de sons

Ver `services/soundEffects.ts` na seção de serviços acima. Duas regras que não têm exceção:

1. **Toda ação clicável relevante tem um som próprio.** Se você adicionar um botão/campo/transição novo, ele precisa de um `playXSound()` novo.
2. **Nenhum som é reaproveitado pra uma ação com significado diferente de outra que já tem som.** A única exceção é a mesma ação semântica repetida em telas diferentes (ex: "Voltar" usa sempre `playBackButtonSound()`, não importa em qual tela).

Cada som pertence a uma categoria (`SoundCategory` em `constants/soundEffects.ts`: Interface, Sala, Chat, Chamada de voz, Compartilhamento), e o usuário controla o volume de cada categoria separadamente na tela de Configurações (mixer). Os arquivos `.wav` em `assets/sounds/` são sintetizados por script (tons puros/triangulares/quadrados/dente-de-serra com envelope de ataque/liberação) — não baixados de banco de som externo, mantendo a filosofia de não depender de rede além do broker PeerJS.

## Múltiplas salas ao mesmo tempo

Como `RoomClient` não guarda nenhum estado global/singleton (cada `new RoomClient()` tem seu próprio `PeerConnectionManager`, `VoiceChat`, `MediaSharing`, `ChatService`), o app consegue ter várias instâncias vivas em paralelo. `useRoomSessions.ts` gerencia a lista (`RoomSession[]`, cada uma com `{ sessionId, roomClient, roomCode, unreadCount }`) e qual está em foco. Só a sessão em foco monta o `<Room>` completo com vídeo/áudio de verdade — as outras continuam conectadas em segundo plano (mesh, chat, notificações), sem UI de vídeo/áudio montada. **A voz é exclusiva da sessão em foco**: trocar de foco chama `roomClient.pauseVoice()`/`resumeVoice()`.

## Teclas de atalho e push-to-talk

Duas mecânicas diferentes, escolhidas pelo que cada ação realmente precisa:

- **Mutar mic / mutar áudio** (`main/toggleHotkeys.ts`): só precisam saber "a tecla foi apertada", não quando foi solta — por isso usam `globalShortcut.register(accelerator, callback)`, a API nativa do próprio Electron, sem dependência externa. A gravação da tecla acontece inteiramente no **renderer**, com um `keydown` comum do DOM enquanto a tela de Configurações está em foco (`lib/keyboardAccelerator.ts` converte `KeyboardEvent.code` pro formato de accelerator do Electron, ex: `"F13"`, `"Control+Shift+M"`) — não precisa de IPC nem de captura global só pra **descobrir** qual tecla foi apertada, já que isso só exige o app estar em foco no momento da gravação (diferente de _usar_ o atalho depois, que aí sim precisa funcionar sem foco).
- **Push-to-talk** (`main/globalHotkeys.ts`): precisa saber quando a tecla é solta, pra cortar o mic — a API `globalShortcut` do Electron não avisa isso, só `uiohook-napi` (dependência nativa, captura de teclado em nível de sistema) dá `keydown`/`keyup` de verdade. A gravação da tecla de PTT também passa pelo processo principal: pede pra escutar o **próximo** `keydown` global do `uiohook-napi` e devolve o keycode + um nome legível — precisa ser assim (diferente do fluxo acima) porque o valor salvo tem que bater com o mesmo espaço de códigos usado em tempo real, e o `KeyboardEvent.code` do DOM não é compatível com o keycode do `uiohook-napi`.

Push-to-talk reaproveita o mecanismo de mute normal (`RoomClient.setMicMuted()`) em vez de um estado paralelo, pra manter o indicador visual e o som de mutar sempre corretos.

Como toda dependência nativa deste projeto, a captura de teclado do `uiohook-napi` carrega com `import()` dinâmico dentro de `startGlobalHotkeys()`, com `try/catch` — se falhar (sistema sem suporte, permissão negada), push-to-talk fica indisponível, mas mutar mic/áudio por atalho continuam funcionando normalmente (não dependem dela). O resultado (sucesso ou falha) é registrado na categoria "Teclas de atalho" da tela de Logs — é o primeiro lugar a checar se um atalho parar de responder.

## Segurança do processo principal

- `contextIsolation: true`, `nodeIntegration: false` — o renderer nunca tem acesso direto ao Node.js.
- `setPermissionRequestHandler` só libera a permissão `media` (câmera/microfone) — qualquer outra permissão do navegador é negada.
- Dependências nativas (`.node`) sempre carregadas com `import()` dinâmico dentro de uma função, nunca no topo do arquivo — um `require`/`import` estático de uma lib nativa ausente derruba o processo principal inteiro antes de qualquer verificação de configuração acontecer (já aconteceu neste projeto).
