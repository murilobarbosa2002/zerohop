---
paths:
  - "src/main/**"
  - "src/preload/**"
---

# Electron / segurança

- `contextIsolation: true`, `nodeIntegration: false` sempre. Toda comunicação main↔renderer passa pelo `preload.js` via `contextBridge`. Exemplo real do padrão (canal IPC → handler no main → função exposta no preload):

  ```ts
  // src/shared/ipcChannels.ts
  export const IPC_CHANNELS = {
    getAllowUnknownInvites: 'get-allow-unknown-invites',
    setAllowUnknownInvites: 'set-allow-unknown-invites'
  } as const;
  ```

  ```ts
  // src/main/ipc.ts
  ipcMain.handle(IPC_CHANNELS.getAllowUnknownInvites, (): boolean => getSettings().allowUnknownInvites);
  ```

  ```ts
  // src/preload/index.ts
  const api = {
    getAllowUnknownInvites: (): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.getAllowUnknownInvites)
  };
  contextBridge.exposeInMainWorld('api', api);
  ```
- Nunca usar `eval`, nunca desabilitar sandboxing sem motivo documentado no `CLAUDE.md`.
- Flags de linha de comando do Chromium (`app.commandLine.appendSwitch`) só devem ser adicionadas com justificativa clara e testada em mais de uma versão do Windows quando possível — ver `.claude/rules/bug-history-capture-and-audio.md` antes de mexer nisso.
- **DevTools foi removido de propósito** (atalho F12/Ctrl+Shift+I desligado em `main/window.ts`) — a tela de Logs (`components/LogsScreen/`, alimentada por `main/logger.ts`) já cobre a auditoria. **Não reativar o atalho de DevTools** sem pedir confirmação explícita.
- **NUNCA importar uma dependência nativa (native addon `.node`) de forma estática no topo de um arquivo do processo principal.** Sempre `import()` dinâmico dentro das funções que usam a lib, com `try/catch` retornando `null` em caso de falha — ver `.claude/rules/bug-history-capture-and-audio.md` pro incidente que motivou essa regra.
- Dependências nativas (`loopback-capture`, `node-window-manager`) precisam entrar em `build.asarUnpack` no `package.json`, senão o `.node` compilado fica preso dentro do `app.asar`.
