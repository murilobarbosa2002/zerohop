---
paths:
  - "e2e/**"
  - "src/renderer/src/services/room/**"
  - "src/renderer/src/services/RoomClient.ts"
---

# Testes

- Não existe suite de testes automatizada formal fora de `e2e/`. Validação é feita rodando o app de verdade via Playwright (`playwright-core`) contra o Electron empacotado, sob `xvfb-run`, simulando duas instâncias quando o teste envolve a sala/P2P.
- Sempre que uma mudança tocar em `RoomClient`/sala, testar o fluxo completo: criar sala → entrar com código → compartilhar tela → assistir — não só que o código não quebra, mas que a UI reflete o estado corretamente nos dois lados.
- **`e2e/helpers/launchApp.mjs` isola o perfil do Electron por instância** (`--user-data-dir` único via `mkdtempSync`). Se um teste ficar travado esperando "Criar sala nova" sem mexer em Contatos, suspeitar primeiro de vazamento de estado entre specs (perfil compartilhado), não de lógica de sala.
