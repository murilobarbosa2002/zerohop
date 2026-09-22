---
name: release
description: Publica uma nova versão do ZeroHop (bump de versão, docs/releases/vX.Y.Z.md, índice do CHANGELOG.md, tag e push). Use quando o usuário pedir pra "publicar uma versão nova", "fazer um release", "subir a próxima versão" ou similar.
when_to_use: O usuário quer publicar/lançar uma nova versão do app pros usuários finais (não confundir com só commitar uma mudança de código).
disable-model-invocation: true
---

# Publicar uma release do ZeroHop

Processo documentado em `.claude/rules/build-and-release.md` — esta skill só formaliza os passos em ordem. **Cada passo abaixo que afeta o repositório remoto (push, tag) é uma ação de alto impacto: confirme com o usuário antes de executar, mesmo que ele já tenha pedido "publica uma versão nova" — confirme a versão exata e o conteúdo do changelog antes do push/tag.**

1. **Decidir o número da versão** (semver) com o usuário, baseado no que mudou desde a última tag (`git log <última-tag>..HEAD --oneline`). Bump de patch/minor/major segue o impacto: `fix` isolado → patch; `feat` → minor; mudança de arquitetura/breaking → major.
2. **Atualizar `version` no `package.json`.**
3. **Criar `docs/releases/vX.Y.Z.md`** seguindo exatamente o padrão dos arquivos existentes (ver `docs/releases/v0.36.30.md` como referência de formato):

   ```markdown
   # vX.Y.Z - Título curto resumindo a versão

   ## Novo

   | Item | Descrição |
   | --- | --- |
   | Nome curto da feature | Frase explicando o que mudou pro usuário |

   ## Melhorado

   | Item | Descrição |
   | --- | --- |

   ## Corrigido

   | Item | Descrição |
   | --- | --- |

   ## Removido

   | Item | Descrição |
   | --- | --- |
   ```

   Só inclua as seções (`Novo`/`Melhorado`/`Corrigido`/`Removido`) que tiverem conteúdo nesta versão — não deixar seção vazia. Nunca mencionar `CLAUDE.md`/`.claude/rules/`/processo interno de desenvolvimento (ver `.claude/rules/markdown.md`).
4. **Adicionar uma linha no topo da tabela-índice do `CHANGELOG.md`** na raiz, no mesmo formato das linhas existentes: `| [X.Y.Z](docs/releases/vX.Y.Z.md) | Resumo de uma linha |`. O `CHANGELOG.md` continua sendo só a tabela-índice, nunca o detalhamento — e a linha nova sempre entra logo abaixo do cabeçalho da tabela (versão mais recente primeiro).
5. **Bump a marcação de versão em `src/renderer/src/main.tsx`** (`console.log('[build] ZeroHop vX')`), se ainda não foi feito nesta entrega.
6. Rodar `npm run typecheck`, `npm run format:check` e `npm run lint:md` antes de commitar — a mesma checagem que o CI roda.
7. **Commitar tudo** seguindo `.claude/rules/commits.md` (Conventional Commits, português, sem menção a IA/Claude).
8. **Confirmar com o usuário antes de criar a tag e dar push** — isso dispara o build real no GitHub Actions e publica em Releases.
9. Criar a tag: `git tag vX.Y.Z` e `git push --tags` (junto com o push normal do commit).
10. O GitHub Actions compila o instalador NSIS numa máquina Windows real e publica em Releases automaticamente — o app já embutido com `electron-updater` detecta a nova versão sozinho. Não há passo manual de upload.

**Nunca compilar o instalador localmente via `npm run dist` no WSL** — precisa de Wine, descartado deliberadamente (ver `.claude/rules/build-and-release.md`). `npm run dist:local` existe só pra testes rápidos e não é o caminho de release.
