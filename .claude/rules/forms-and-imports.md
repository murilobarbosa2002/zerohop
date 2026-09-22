# Formulários e imports

## Formulários

- Formulário com mais de um campo usa **React Hook Form + Zod** (`@hookform/resolvers/zod`): schema em `<Componente>.schema.ts`, tipos inferidos do schema (`z.infer<typeof schema>`), nunca `useState` por campo controlado na mão.

## Imports

- Alias configurados em `electron.vite.config.ts` **nos três processos** e espelhados em `tsconfig.node.json`/`tsconfig.web.json`: `@shared/*` → `src/shared/*` (main/preload/renderer); `@main/*` → `src/main/*` (só main); `@/*` → `src/renderer/src/*` (só renderer).
- **Regra sem exceção: todo import usa o alias, inclusive entre arquivos irmãos na mesma pasta.** Nunca `./Card.types`, sempre `@/components/Card/Card.types`. Isso faz o arquivo sobreviver a ser movido de pasta sem quebrar silenciosamente. Exemplo real, três aliases diferentes no mesmo arquivo:

  ```ts
  // src/renderer/src/components/ContactsScreen/ContactsScreen.tsx
  import { Card } from '@/components/Card';
  import { useContacts } from '@/hooks/useContacts';
  import { watchContactsPresence } from '@/services/contactPresence';
  import { CONTACTS_STRINGS } from '@/strings/contacts.strings';
  import type { Contact } from '@shared/contact';
  ```

  ```ts
  // src/main/ipc.ts
  import { getSettings, setHotkeySettings } from '@main/settings';
  import { IPC_CHANNELS } from '@shared/ipcChannels';
  ```
- **Única exceção legítima:** import de efeito colateral sem `from` (ex: `import '@/index.css';` num arquivo de entrada).
