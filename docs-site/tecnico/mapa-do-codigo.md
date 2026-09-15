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
| `index.ts`         | Ponto de entrada. Configura flags do Chromium, lê `settings.json`, cria a janela, registra os handlers de IPC e inicia o updater.                                                                                  |
| `window.ts`        | Cria a `BrowserWindow` (sem moldura nativa — a barra de título é toda customizada em React) e intercepta o evento `close` pra dar tempo do som de fechar tocar antes da janela morrer de verdade.                  |
| `ipc.ts`           | Todos os handlers `ipcMain.handle`/`ipcMain.on` num só lugar — é o "menu" completo de tudo que o renderer pode pedir pro main fazer.                                                                               |
| `settings.ts`      | Lê/escreve `settings.json` (fica em `app.getPath('userData')`) — auto-update, atalhos de teclado, flags experimentais. Isso é diferente do `localStorage` do renderer (ver **Onde cada preferência mora** abaixo). |
| `toggleHotkeys.ts` | Registra mutar mic/áudio como atalhos globais via `globalShortcut` do Electron — funcionam com outro programa em foco, sem depender de nenhuma lib nativa.                                                         |
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
- **`*Preference.ts`** (`soundEffectsPreference`, `uiScalePreference`, `micInputPreference`, `audioOutputPreference`, `avatarPreference`, `namePreference`) — preferências do usuário guardadas no `localStorage` do renderer, cada uma com seu próprio `get`/`set`/`subscribe`. O nome (`namePreference.ts`, v0.36.23+) segue o mesmo padrão do avatar: salvo automaticamente sempre que muda, sem precisar de um botão "salvar" — assim quem já preencheu nome/avatar uma vez não precisa digitar de novo em Criar sala, Entrar numa sala ou Contatos, já vem tudo preenchido.
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

- **Volume dos sons, escala, dispositivos** → `localStorage` do renderer, porque só o processo de UI precisa desses valores.
- **Atalhos de teclado, flags, auto-update** → `settings.json` (via `main/settings.ts`), porque mic/áudio dependem do `globalShortcut` do main, e é o main que decide se ativa flags do Chromium.

A **lista de contatos** foge desse padrão de propósito: mora num arquivo próprio, `contacts.json` (via `main/contacts.ts`), em vez de `localStorage`. É uma escolha deliberada, não técnica — é uma lista pequena que o usuário entende como "meus dados salvos", igual `logs.jsonl`/`settings.json`, mais fácil de inspecionar ou fazer backup manualmente do que algo preso dentro do perfil do Chromium.

## Contatos e sala pessoal

Duas peças novas, pensadas pra não mexer em nada do protocolo de sala existente:

- **ID pessoal** (`services/personalRoomPreference.ts`): gerado uma vez por instalação (`localStorage`, não `contacts.json` — é um dado do PRÓPRIO usuário, não uma lista de terceiros) e usado como `desiredCode` ao chamar `RoomClient.createRoom(name, password, avatarId, desiredCode)` — um parâmetro novo, opcional, que faz o método pular o loop de gerar um `randomRoomCode()` e usar esse valor fixo direto. Na prática, sua "sala pessoal" é uma sala normal, só que sempre com o mesmo código.
- **Contatos** (`contacts.json`, `hooks/useContacts.ts`): cada contato é `{ id, name, password }` — o `id` e a senha são exatamente o que a outra pessoa mostra na própria tela de Contatos, trocados manualmente uma vez (fora do app, por WhatsApp/Discord/etc). "Chamar" um contato é literalmente `RoomClient.joinRoom(name, contact.id, contact.password, avatarId)` — a mesma função que "Entrar numa sala" usa, só que os campos já vêm preenchidos.

**"Chamar" um contato ainda passa pela aprovação manual de entrada**, igual qualquer sala — quem chama ainda precisa que o dono da sala pessoal aprove manualmente. Nunca existiu (e não existe) um caminho de "auto-aprovar" só porque o peer ID bate com um contato salvo — isso enfraqueceria a mesma proteção que toda sala já tem (senha errada precisa ser silenciosa, nunca revelar se alguém "quase" acertou).

### Convidar contatos pra uma sala nova (pula a aprovação — v0.36.25+)

Pedido explícito do usuário: ao **criar** uma sala nova, dá pra marcar contatos salvos pra convidar direto — sem precisar mandar código/senha por fora, e sem precisar aprovar manualmente quando a pessoa entrar. Isso É uma exceção deliberada à regra acima, mas construída com cuidado pra não abrir brecha nenhuma:

- **Como o convite chega:** `PeerConnectionManager.sendInvite(peerId, message)` abre uma conexão PeerJS avulsa (fora do fluxo normal de membro/mesh — não passa por `registerDataConnection`, então não dispara o `hello` automático desse lado), manda uma mensagem `{ type: 'invite', roomCode, roomPassword, inviteToken, hostId, hostName, hostAvatarId }` e fecha. Do lado de quem recebe, essa mensagem é interceptada dentro do handler de `'data'` já existente (antes de virar um `RoomMessage` normal) e desviada pra um dep `onInviteMessage`, nunca chega no `RoomProtocol.handleMessage` comum.
- **Verificação mútua obrigatória:** quem recebe só mostra o convite se `hostId` (o ID pessoal ESTÁVEL de quem convidou, não o peer ID efêmero da sala nova) estiver na PRÓPRIA lista de contatos de quem recebeu (`RoomClient.handleInviteMessage` confere via `window.api.getContacts()`). Ou seja: só aceita convite de alguém que EU também salvei como contato — evita popup de estranho que descobriu meu ID pessoal por acaso.
- **Por que um token, e não só "peer ID pré-autorizado":** a primeira versão dessa ideia tentava pré-autorizar o `contact.id` (o ID pessoal do convidado) direto em `RoomAuthController`. Não funciona: `joinRoom` sempre abre a conexão com um peer ID novo e aleatório (`this.connections.open(undefined, ...)`), nunca com o ID pessoal — então o pedido de entrada que chega de verdade nunca bate com o ID que foi pré-autorizado. A solução foi trocar por um **token de uso único**: `RoomAuthController.preAuthorizeToken(token)` guarda o token gerado na hora do convite; o convidado carrega esse token junto do `hello` (`helloMessageSchema.inviteToken`, opcional) quando entra; `handleJoinRequest` confere o token (não o peer ID) e, se bater, aprova igual `approveJoinRequest` faria — sem nunca colocar na fila (`pendingJoinRequests`) nem mostrar o `JoinRequestModal`.
- **Limitação aceita:** só dá pra convidar um contato que esteja com a sala pessoal DELE aberta no momento — é a única forma de alcançar o peer ID dele sem servidor de presença (mesma limitação de "Chamar", só que na direção contrária).

## Sistema de sons

Ver `services/soundEffects.ts` na seção de serviços acima. Duas regras que não têm exceção:

1. **Toda ação clicável relevante tem um som próprio.** Se você adicionar um botão/campo/transição novo, ele precisa de um `playXSound()` novo.
2. **Nenhum som é reaproveitado pra uma ação com significado diferente de outra que já tem som.** A única exceção é a mesma ação semântica repetida em telas diferentes (ex: "Voltar" usa sempre `playBackButtonSound()`, não importa em qual tela).

Cada som pertence a uma categoria (`SoundCategory` em `constants/soundEffects.ts`: Interface, Sala, Chat, Chamada de voz, Compartilhamento), e o usuário controla o volume de cada categoria separadamente na tela de Configurações (mixer). Os arquivos `.wav` em `assets/sounds/` são sintetizados por script (tons puros/triangulares/quadrados/dente-de-serra com envelope de ataque/liberação) — não baixados de banco de som externo, mantendo a filosofia de não depender de rede além do broker PeerJS.

## Múltiplas salas ao mesmo tempo

Como `RoomClient` não guarda nenhum estado global/singleton (cada `new RoomClient()` tem seu próprio `PeerConnectionManager`, `VoiceChat`, `MediaSharing`, `ChatService`), o app consegue ter várias instâncias vivas em paralelo. `useRoomSessions.ts` gerencia a lista (`RoomSession[]`, cada uma com `{ sessionId, roomClient, roomCode, unreadCount }`) e qual está em foco. Só a sessão em foco monta o `<Room>` completo com vídeo/áudio de verdade — as outras continuam conectadas em segundo plano (mesh, chat, notificações), sem UI de vídeo/áudio montada. **A voz é exclusiva da sessão em foco**: trocar de foco chama `roomClient.pauseVoice()`/`resumeVoice()`.

## Teclas de atalho e push-to-talk

Duas mecânicas diferentes, escolhidas pelo que cada ação realmente precisa:

- **Mutar mic / mutar áudio** (`main/toggleHotkeys.ts`): só precisam saber "a tecla foi apertada", não quando foi solta — por isso usam `globalShortcut.register(accelerator, callback)`, a API nativa do próprio Electron, sem dependência externa. Funcionam com **qualquer** programa em foco, inclusive um jogo em tela cheia.
- **Push-to-talk** (`renderer/src/hooks/usePushToTalk.ts`): precisa saber quando a tecla é solta, pra cortar o mic — e desde a v0.36.22 isso é feito com `keydown`/`keyup` comuns do DOM, inteiramente no **renderer**, sem nenhuma dependência nativa. **Limitação deliberada: só funciona com o ZeroHop em primeiro plano**, diferente dos dois atalhos acima. Foi uma troca de arquitetura, não um ajuste fino — depois de duas bibliotecas nativas diferentes (`uiohook-napi` na v0.36.9-v0.36.20, `node-global-key-listener` na v0.36.21) falharem do mesmo jeito na mesma máquina de um usuário (a gravação de tecla funcionava, o uso real não, sem nenhum log de erro nos dois casos), ficou claro que captura de teclado em nível de sistema nessa máquina específica não é confiável com nenhuma lib testada. A troca pro DOM sacrifica "funcionar com outro jogo em foco" em troca de 100% de confiabilidade (sem processo externo, sem addon nativo, sem nada que um antivírus possa bloquear silenciosamente).

A gravação da tecla de PTT usa exatamente o mesmo `lib/keyboardAccelerator.ts` que mic/áudio já usavam — não existe mais um formato de tecla separado (`HotkeyBinding`/`keycode` sumiu, tudo é `AcceleratorBinding` agora). Push-to-talk reaproveita o mecanismo de mute normal (`RoomClient.setMicMuted()`) em vez de um estado paralelo, pra manter o indicador visual e o som de mutar sempre corretos. A configuração de atalhos ainda mora em `settings.json` (não `localStorage`), porque mic/áudio continuam dependendo do main (`globalShortcut`) — o main avisa o renderer de qualquer mudança via o canal `hotkeySettingsChanged`, pra `usePushToTalk` sempre ler a tecla mais recente mesmo com a tela de Configurações aberta por cima da sala.

## Segurança do processo principal

- `contextIsolation: true`, `nodeIntegration: false` — o renderer nunca tem acesso direto ao Node.js.
- `setPermissionRequestHandler` só libera a permissão `media` (câmera/microfone) — qualquer outra permissão do navegador é negada.
- Dependências nativas (`.node`) sempre carregadas com `import()` dinâmico dentro de uma função, nunca no topo do arquivo — um `require`/`import` estático de uma lib nativa ausente derruba o processo principal inteiro antes de qualquer verificação de configuração acontecer (já aconteceu neste projeto).
