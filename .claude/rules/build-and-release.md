---
paths:
  - "package.json"
  - ".github/workflows/**"
  - "docs/releases/**"
  - "CHANGELOG.md"
  - "src/renderer/src/main.tsx"
---

# Build e releases

- **O instalador Windows (NSIS) NUNCA é compilado localmente no WSL/Linux** — isso exigiria Wine, descartado deliberadamente. A compilação acontece só via GitHub Actions, numa máquina Windows real (`.github/workflows/release.yml`), disparada por push de uma tag `vX.Y.Z`.
- `npm run dist:local` gera a pasta portátil de teste (`dist/win-unpacked`, target `dir`, sem edição de recursos do `.exe`) localmente no WSL, sem precisar de Wine — só pra testar rápido. NÃO é o artefato de release oficial. `npm run dist` (sem `:local`) é o comando do CI e tenta compilar o NSIS de verdade — **não rodar localmente no WSL**, vai pedir Wine.
- **Sempre verificar se o build terminou de verdade antes de instruir o usuário a copiar a pasta** — checar `ls dist/win-unpacked/ZeroHop.exe` sempre depois de buildar.
- Bump a marcação de versão em `src/renderer/src/main.tsx` (`console.log('[build] ZeroHop vX')`) a cada build entregue para teste — facilita confirmar que o usuário está testando a versão certa.
- Use a skill `release` pro fluxo completo de publicar uma versão nova (bump de versão, `docs/releases/`, `CHANGELOG.md`, tag).

## Changelog e documentação de release

- `CHANGELOG.md` na raiz é só uma **tabela-índice** (versão + resumo de uma linha). Nunca colocar o detalhamento ali.
- O detalhamento completo de cada versão vai em `docs/releases/vX.Y.Z.md`, um arquivo por versão.
