# Processo de desenvolvimento

- **Nunca decidir sozinho em algo ambíguo ou com mais de um caminho razoável.** Perguntar antes de escolher, especialmente em decisões de arquitetura, dependências novas, ou qualquer coisa que afete segurança/dados do usuário.
- **Analisar o fluxo e o código existentes antes de alterar qualquer coisa.** Entender o que já existe, como as peças se conectam, e por que estão do jeito que estão antes de propor uma mudança.
- **Sempre montar um plano de implementação antes de mudanças não triviais** (mais de um arquivo, nova dependência, mudança de arquitetura), listando o que será tocado e por quê.
- **Sempre revisar o plano com o usuário antes de executar** — não implementar direto a partir da primeira ideia.
- **Sempre testar de verdade depois de implementar** — rodar o app, validar o fluxo completo afetado (ver `.claude/rules/testing.md`).
- **REGRA DE BLOQUEIO — nenhuma tarefa está terminada sem a documentação em dia.** Toda mudança visível/relevante pro usuário final entra, na mesma entrega: `CHANGELOG.md` + `docs/releases/vX.Y.Z.md`, `README.md` quando ficar desatualizado, e a página correspondente em `docs-site/guia/` ou `docs-site/seguranca/`. "Vou fazer o código agora e a doc depois" não é uma opção válida.
- **REGRA DE BLOQUEIO — mudança de arquitetura/código também precisa atualizar a documentação técnica.** Serviço/hook/componente novo, mudança de onde uma preferência é guardada, dependência nativa nova, mudança de protocolo de sala, ou qualquer coisa descrita em `docs-site/tecnico/` (`arquitetura.md`, `mapa-do-codigo.md`, `manutencao.md`, `stack.md`) — essas páginas entram na mesma entrega.
