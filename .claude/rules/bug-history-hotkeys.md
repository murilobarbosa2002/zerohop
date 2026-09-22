---
paths:
  - "src/main/toggleHotkeys.ts"
  - "src/main/globalHotkeys.ts"
  - "src/renderer/src/hooks/usePushToTalk.ts"
  - "src/renderer/src/components/SettingsScreen/HotkeySettings.tsx"
---

# Histórico de bugs — teclas de atalho / push-to-talk (não repetir)

Duas bibliotecas nativas diferentes de captura de teclado (`uiohook-napi` v0.36.9-v0.36.20, `node-global-key-listener` v0.36.21) falharam **exatamente do mesmo jeito silencioso** na mesma máquina real do usuário (gravar a tecla funcionava, usar de verdade não, sem log de erro nos dois casos). Sintomas variaram entre sessões (nunca iniciava / iniciava mas não entregava eventos / logs vazios), o que descarta "biblioteca ruim" como causa única e aponta pra algo específico da máquina/antivírus bloqueando captura de teclado em nível de sistema.

- **Decisão do usuário: abandonar captura nativa de teclado por padrão.** Push-to-talk virou `keydown`/`keyup` do DOM no renderer (`usePushToTalk.ts`), só funciona com o app em foco. Na v0.36.25, `uiohook-napi` foi reativado **em paralelo** como melhor esforço — funciona sem foco se inicializar na máquina do usuário, mas o fallback por DOM garante funcionamento mínimo se falhar de novo.
- **Não tentar uma terceira dependência nativa de captura de teclado sem motivo muito forte** — o padrão de evidência (2 libs, falhas idênticas) é forte o bastante pra não valer a pena.
- **Se `startGlobalHotkeys()` falhar silenciosamente, `recordNextHotkey()` fica esperando pra sempre sem aviso.** Corrigido registrando log em `LogCategory.HOTKEYS` assim que a captura começa a tentar iniciar (antes de qualquer `await`), envolvendo o carregamento e o `.start()` num `Promise.race` contra `HOTKEYS_INIT_TIMEOUT_MS`, e um timeout de `RECORD_HOTKEY_TIMEOUT_MS` (8s) na UI de gravação (`HotkeyRecorderRow.tsx`) mostrando mensagem clara em vez de ficar preso em "Aperte uma tecla...".
- **Se voltar a acontecer, o primeiro passo é checar a categoria "Teclas de atalho" na tela de Logs** pra saber se a captura nativa sequer iniciou.
- `HotkeyBinding.keycode: number` (uiohook) virou `HotkeyBinding.key: string` numa troca de lib — settings antigas com o campo `keycode` não validam mais e a tecla salva reseta, esperado numa troca de lib.
