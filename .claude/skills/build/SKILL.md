---
name: build
description: Builda o ZeroHop localmente (bundle Vite + pasta portátil pra teste no WSL) e confirma que o artefato terminou de verdade antes de dizer que está pronto pra copiar/testar. Use quando o usuário pedir pra "buildar", "gerar uma build pra testar" ou similar — não confundir com publicar uma release oficial (skill `release`).
when_to_use: O usuário quer uma build local pra testar, não uma release publicada no GitHub.
allowed-tools: Bash(npm run *), Bash(ls *)
---

# Build local de teste

**Isso NUNCA gera o instalador oficial** — o instalador NSIS só é compilado via GitHub Actions numa máquina Windows real (ver `.claude/rules/build-and-release.md`). Esta skill é só pra gerar algo rápido de testar localmente no WSL, sem Wine.

1. Rode `npm run build` (bundle Vite/electron-vite em `out/`).
2. Rode `npm run dist:local` (gera a pasta portátil em `dist/win-unpacked`, target `dir`, sem editar recursos do `.exe`, sem precisar de Wine).
3. **Sempre confirme que o build terminou de verdade antes de dizer que está pronto**: rode `ls dist/win-unpacked/ZeroHop.exe` e confira que o arquivo existe. Já aconteceu de uma sessão ser interrompida no meio do `electron-builder`, deixando só `builder-debug.yml` sem o `.exe` — nunca instrua o usuário a copiar a pasta sem essa checagem.
4. Se o usuário vai testar a build, lembre de bumpar a marcação de versão em `src/renderer/src/main.tsx` (`console.log('[build] ZeroHop vX')`) antes do build, se ainda não foi feito nesta entrega — facilita confirmar que ele está rodando a versão certa (visível na barra de título e no cabeçalho da tela de Logs).
5. **Nunca rodar `npm run dist` (sem `:local`) neste ambiente** — é o comando do CI, vai pedir Wine e falhar no WSL.
