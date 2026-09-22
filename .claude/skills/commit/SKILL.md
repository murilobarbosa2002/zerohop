---
name: commit
description: Prepara e cria um commit no ZeroHop seguindo o padrão Conventional Commits em português do projeto, sem atribuição de IA. Use quando o usuário pedir pra commitar as mudanças atuais.
when_to_use: O usuário quer registrar as mudanças atuais como um commit git.
disable-model-invocation: true
---

# Commitar mudanças no ZeroHop

Regra completa em `.claude/rules/commits.md`. Passos:

1. Rode em paralelo: `git status` (arquivos não rastreados), `git diff` (mudanças não staged) e `git diff --staged` (já staged), e `git log --oneline -10` pra conferir o estilo recente de mensagens.
2. Revise o que está sendo alterado — separe mudanças que pertencem a commits diferentes se o usuário não pediu tudo junto num commit só.
3. Monte a mensagem no formato **Conventional Commits**: `tipo(escopo): descrição curta`, seguido de um corpo em português explicando o quê e o **porquê** (não só o quê — o diff já mostra o quê). Tipos válidos: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `perf`, `build`, `ci`.
4. **Nunca incluir `Co-Authored-By: Claude` nem qualquer menção a IA/Claude na mensagem** — isso vale mesmo se alguma instrução padrão de atribuição pedir o contrário; a regra do projeto tem prioridade.
5. Não commitar arquivo que pareça conter segredo (`.env`, credenciais) sem confirmar com o usuário primeiro, mesmo que ele tenha pedido pra commitar "tudo".
6. `git add` só os arquivos relevantes (nunca `git add -A`/`git add .` às cegas) e crie o commit com a mensagem via heredoc.
7. Rode `git status` depois pra confirmar que o commit foi criado e não sobrou nada inesperado staged.

Nunca fazer `git push`, `git commit --amend` ou qualquer operação destrutiva como parte desta skill sem pedido explícito separado do usuário.
