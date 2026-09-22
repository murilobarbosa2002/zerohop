# Tipos, enums e strings visíveis

## Tipos

- **Todo componente com props tem um `<Componente>.types.ts` ao lado**, exportando a(s) `interface`/`type`. O `.tsx` só importa o tipo — nunca declara a interface de props inline no mesmo arquivo do componente. Exemplo real:

  ```ts
  // src/renderer/src/components/Room/InviteContactsPanel.types.ts
  import type { Contact } from '@shared/contact';
  import type { MemberSnapshot } from '@/services/room/MemberRegistry';

  export interface InviteContactsPanelProps {
    contacts: Contact[];
    members: MemberSnapshot[];
    hasContactJoinedViaInvite: (contactId: string) => boolean;
    onInvite: (contact: Contact) => void;
    failedContactIds: Set<string>;
  }
  ```

  ```tsx
  // src/renderer/src/components/Room/InviteContactsPanel.tsx
  import type { InviteContactsPanelProps } from '@/components/Room/InviteContactsPanel.types';

  export function InviteContactsPanel({ contacts, members, onInvite, failedContactIds }: InviteContactsPanelProps) {
  ```
- Props sempre com `interface` nomeada, nunca props inline sem tipo nem `React.FC`.
- **Props mínimas e específicas** (Interface Segregation) — nunca passar um objeto "config" gigante quando o componente só usa 2 campos dele.
- Tipos de domínio usados por mais de um componente/hook (ex: formato de mensagem do protocolo de sala) ficam no arquivo do serviço dono do domínio (ex: `services/RoomClient.ts` exporta `RoomClientEventDetail`) — só tipos exclusivos de UI (props de componente) vão em `.types.ts`.

## Enums e constantes nomeadas (nunca valor mágico)

- Todo valor com significado especial (chave de resolução/fps, modo de áudio, status de sala, timeout, tamanho de retry) é um `enum` ou constante nomeada em `src/renderer/src/constants/`, nunca string/número solto repetido pelo código.
- Timeouts, tentativas de retry, intervalos de polling — tudo nomeado em `constants/timing.ts` (`ICE_CONNECTION_TIMEOUT_MS`, etc.), nunca `10000`/`1500`/`4` soltos na lógica.
- **Isso vale em `services/`, não só em componentes.** Antes de considerar qualquer lógica de negócio pronta, releia a função procurando número/string literal que não seja `0`, `1`, `-1` ou índice de loop puro — se achar, vira constante nomeada antes de finalizar, não depois.

## Strings visíveis ao usuário

- Toda string mostrada na interface (botão, label, placeholder, mensagem de erro/status) vive em `src/renderer/src/strings/`, um arquivo por área, exportando um objeto `as const`. O componente importa (`ROOM_STRINGS.startSharingButton`), nunca texto solto no JSX.
- Mensagens com interpolação viram função dentro do objeto de strings, não concatenação montada no componente. Exemplo real:

  ```ts
  // src/renderer/src/strings/notifications.strings.ts
  export const NOTIFICATIONS_STRINGS = {
    inviteSendFailedMessage: (name: string) => `Não foi possível convidar ${name} — a pessoa parece estar offline agora.`
  } as const;
  ```
- **`new Error('texto solto')` dentro de um `service/` é a mesma violação, disfarçada** — se a mensagem pode chegar à UI (via `errorMessage(error)`, por exemplo), ela pertence a `strings/`. Antes de escrever `throw new Error(...)`, pergunte: essa mensagem pode chegar à UI? Se sim, vira entrada em `strings/` primeiro.
