# Estrutura de pastas por responsabilidade

Resumo em uma frase: três camadas fixas do Electron (`main`, `preload`, `renderer`), e dentro do `renderer` uma separação estrita entre lógica (`services/`), ponte com o React (`hooks/`) e interface (`components/`). Ver `.claude/rules/architecture.md` pra regras de dependência entre camadas.

**Esta rule é o resumo rápido pra orientação. O mapa completo, arquivo por arquivo, com exemplos reais de cada padrão aplicado ao longo do projeto, vive em `docs-site/tecnico/mapa-do-codigo.md` — leia esse arquivo inteiro antes de decidir onde um código novo deve morar, se não estiver óbvio pelos exemplos abaixo.**

## As camadas

```text
src/
  main/       processo principal (Node.js puro) — window, ipc, settings.json, updater, logs
  preload/    ponte contextBridge — o ÚNICO jeito do renderer falar com o main
  shared/     tipos/constantes usados dos DOIS lados (main e renderer), sem lógica de nenhum
  renderer/
    src/
      services/    lógica de negócio, SEM tocar em DOM/React
      hooks/       ponte entre services (EventTarget) e React (useSyncExternalStore)
      components/  interface
      constants/   enums e constantes nomeadas (ver abaixo)
      strings/     strings visíveis ao usuário, um arquivo por área
      App.tsx      composition root
      main.tsx     ponto de entrada
```

## `services/` — real, `services/room/` como referência de divisão por responsabilidade

`RoomClient.ts` é o orquestrador fino de uma sala; ele delega cada responsabilidade distinta pra um sub-serviço dedicado em `services/room/`, em vez de concentrar tudo numa classe só:

```text
services/room/
  PeerConnectionManager.ts   ciclo de vida das conexões WebRTC (abrir/aceitar/fechar/reconectar)
  RoomAuthController.ts      aperto de mão inicial, versão do app, aprovação de entrada
  RoomProtocol.ts            interpreta as mensagens do protocolo de sala
  MemberRegistry.ts          estado de quem está na sala
  MembershipGossip.ts        propaga a lista de membros pra malha inteira
  MediaSharing.ts            envia vídeo só pra quem pediu pra assistir
  VoiceChat.ts               chamada de voz broadcast com retry/timeout
  ChatService.ts             histórico de chat em memória
  peerSession.ts, iceDiagnostics.ts, turnCredentials.ts, videoBitrate.ts   utilidades de baixo nível
```

Cada arquivo tem uma responsabilidade que dá pra descrever numa frase — esse é o teste (ver `.claude/rules/architecture.md`) pra saber se um arquivo deveria ser dividido.

## `components/` — pasta por componente quando tem subcomponentes, real

```text
components/
  Room/
    Room.tsx
    Room.types.ts
    RoomSidebar/
      RoomSidebar.tsx
      RoomSidebar.types.ts
    RoomToolbar.tsx
    InviteContactsPanel.tsx
    InviteContactsPanel.types.ts
  ActionButton/
    ActionButton.tsx
    ActionButton.types.ts
    ActionButton.variants.ts
  ContactsScreen/
    ContactsScreen.tsx
    ContactRow.tsx
    PersonalRoomCard.tsx
    AddContactForm.tsx
```

`App.tsx` é a única composition root: decide o layout geral e qual overlay (Configurações, Logs, Notificações, Contatos) está ativo. Componentes de apresentação (`ContactRow.tsx`) só recebem props; componentes conectados (`ContactsScreen.tsx`) chamam os hooks.

## `constants/` — enum real + label separado

```ts
// src/renderer/src/constants/soundEffects.ts
export enum SoundCategory {
  INTERFACE = 'interface',
  ROOM = 'room',
  CHAT = 'chat',
  VOICE = 'voice',
  SHARING = 'sharing'
}
```

```ts
// src/renderer/src/constants/timing.ts
export const ICE_CONNECTION_TIMEOUT_MS = 10_000;
export const INVITE_TOKEN_TTL_MS = 5 * 60_000;
```

O rótulo exibido ao usuário nunca fica dentro do enum — vive num `Record<Enum, string>` separado, geralmente perto de onde é usado, ou num arquivo de `strings/`.

## `strings/` — um arquivo por área, `as const`, real

```ts
// src/renderer/src/strings/room.strings.ts
export const ROOM_STRINGS = {
  inviteContactButton: 'Convidar',
  connectionFailedError: 'Não foi possível conectar com a sala',
  versionMismatchError: (ownVersion: string, remoteVersion: string) =>
    `Você está na versão v${ownVersion} e a outra pessoa está na v${remoteVersion} — as duas precisam estar na mesma versão pra entrar na mesma sala.`
} as const;
```

## `hooks/` — ponte real com `useSyncExternalStore`

Serviços expõem estado via `EventTarget`/`CustomEvent`; hooks traduzem isso pro React. `useRoomSessions.ts` é o hook mais importante do app — gerencia a lista de `RoomSession[]` (cada uma com seu próprio `RoomClient`) e qual está em foco. Ver `.claude/rules/bug-history-ui.md` pro padrão obrigatório de `setState` fora de updaters funcionais, que se aplica direto a esse tipo de hook.

## Onde cada preferência mora (decisão deliberada, não acidente)

| Tipo de dado | Onde mora | Por quê |
| --- | --- | --- |
| Volume dos sons, escala, dispositivos | `localStorage` do renderer | só o processo de UI precisa |
| Atalhos de teclado, flags experimentais, `allowUnknownInvites` | `settings.json` via `main/settings.ts` | o `main` decide `globalShortcut`/flags do Chromium |
| Lista de contatos | `contacts.json` via `main/contacts.ts` | escolha deliberada — dado que o usuário entende como "meus dados salvos", fácil de inspecionar, igual `logs.jsonl` |
