---
name: docs
description: Atualiza a documentação do ZeroHop (README.md, docs-site/guia, docs-site/seguranca, docs-site/tecnico) pra cumprir as regras de bloqueio de documentação do projeto depois de uma mudança de código. Use sempre que uma feature nova/alterada/removida ou uma mudança de arquitetura ainda não tiver a doc correspondente atualizada.
when_to_use: Depois de qualquer mudança de código visível ao usuário ou de arquitetura, antes de considerar a tarefa concluída — ver as regras de bloqueio em `.claude/rules/process.md`.
---

# Atualizar a documentação do ZeroHop

Regras de bloqueio completas em `.claude/rules/process.md`. Esta skill cobre a documentação viva do projeto — pro changelog/release notes de uma versão publicada, use a skill `release`.

1. **Classifique a mudança** olhando o diff (`git diff`):
   - **Visível ao usuário final** (feature nova/alterada/removida) → precisa de `README.md` atualizado (se ficou desatualizado/incompleto) e a página correspondente em `docs-site/guia/` ou `docs-site/seguranca/`.
   - **Arquitetura/técnica** (serviço/hook/componente novo, mudança de onde uma preferência é guardada, dependência nativa nova, mudança de protocolo de sala) → precisa da página correspondente em `docs-site/tecnico/` (`arquitetura.md`, `mapa-do-codigo.md`, `manutencao.md`, `stack.md`).
   - Pode ser as duas coisas ao mesmo tempo.
2. **Leia a página existente inteira antes de editar** — mantenha o tom e a estrutura já usados no `docs-site`, não escreva num estilo diferente do resto do site.
3. Edite o(s) arquivo(s) necessário(s). Siga `.claude/rules/markdown.md` à risca (linha em branco ao redor de título/lista/bloco de código, linguagem declarada em todo bloco de código, tabelas espaçadas).
4. Rode `npm run lint:md` e corrija qualquer erro antes de considerar terminado.
5. **"Subir" a doc não é um passo manual separado**: `docs-site/` publica sozinho no GitHub Pages via `.github/workflows/docs.yml` assim que a mudança chega na branch `main` (push direto ou merge de PR) — não existe um comando de deploy pra rodar à mão. O que importa é o arquivo estar certo e commitado.
6. **Nunca mencionar `CLAUDE.md`, `.claude/rules/`, skills, subagents, ou qualquer processo interno de desenvolvimento** em nenhuma dessas páginas — são documentação pra quem usa/mantém o app, não pra como o código foi escrito com IA.
