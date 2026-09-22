# Arquitetura em camadas

```text
src/
  main/          processo principal do Electron (window, ipc, ciclo de vida, updater)
  preload/       ponte contextBridge (única forma de o renderer falar com o main)
  renderer/
    src/
      services/    lógica de negócio, SEM tocar em DOM/React (RoomClient, ScreenCapture, room/*)
      hooks/       pontes entre services (EventTarget) e o React (useSyncExternalStore)
      components/  componentes de UI, um por pasta quando tiver subcomponentes
      App.tsx      composition root — o único lugar que monta o layout geral
      main.tsx     ponto de entrada, monta <App /> no DOM
    index.html
```

- **`services/` nunca importa nada de `components/` ou `hooks/`.** A dependência é sempre `components/` → `hooks/` → `services/`, nunca o contrário. Serviços expõem estado via eventos (`EventTarget`/`CustomEvent`) — framework-agnostic de propósito.
- Um arquivo cresce demais → divide por responsabilidade, não por tamanho arbitrário. Ver `services/room/` (`MemberRegistry`, `MembershipGossip`, `MediaSharing`, `RoomAuthController`, `peerSession`, `iceDiagnostics`, `turnCredentials`, `videoBitrate`) como referência.
- **Critério objetivo pra saber quando dividir**: liste as responsabilidades distintas da classe/arquivo (uma frase cada). Mais de 5-6 responsabilidades claramente diferentes na mesma classe é sinal de dividir, independente de quantas linhas o arquivo tem — um arquivo pequeno também pode estar fazendo coisa demais.
- Ao criar um `service` novo que precisa de algo do processo `main` (ex: versão do app via IPC), **injete a dependência via parâmetro do construtor com um valor padrão**, nunca chame `window.api.*` direto no meio do corpo da classe.
- Tipos compartilhados entre `main` e `preload`/`renderer` (formato das mensagens IPC, payload do `get-sources`, etc.) ficam num arquivo só (`src/shared/`), importado dos dois lados — nunca duas definições de tipo divergentes descrevendo a mesma mensagem.
- Bibliotecas de terceiros são dependências normais do `npm`, importadas como módulo — nada de vendorizar arquivo `.min.js` manualmente.
