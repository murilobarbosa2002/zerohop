---
paths:
  - "e2e/**"
  - ".github/workflows/**"
---

# Histórico de bugs — build / CI / suporte (não repetir)

- **`e2e/helpers/launchApp.mjs` não isolava o perfil do Electron até a v0.36.26.** Instâncias diferentes compartilhavam `~/.config/Electron/` (`contacts.json`/`settings.json`/`Local Storage` inteiro), o que virou bug real quando a sala pessoal ganhou auto-abertura: specs que rodavam depois de `contacts.spec.mjs` herdavam senha de sala pessoal via perfil compartilhado e auto-abriam sozinhas, quebrando a suíte inteira. Corrigido com `--user-data-dir` único (`mkdtempSync`) por chamada de `launchApp()`.
- **Firewalls de terceiros (ESET, etc.) podem gerenciar o Windows Firewall por baixo dos panos** — adicionar exceção pela tela nativa do Windows não resolve nesse caso; a exceção precisa ser criada dentro do próprio antivírus/firewall terceiro.
