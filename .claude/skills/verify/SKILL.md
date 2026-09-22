---
name: verify
description: Roda a mesma checagem estática que o CI do ZeroHop roda — typecheck (tsc), ESLint, Prettier e markdownlint — e reporta os erros encontrados. Use antes de considerar qualquer mudança de código pronta, ou quando o usuário pedir pra "checar"/"validar"/"rodar o lint".
when_to_use: Depois de qualquer mudança de código, antes de considerar a tarefa concluída ou antes de um commit/PR.
allowed-tools: Bash(npm run *)
---

# Verificar tipos, lint e formatação

Roda as quatro checagens estáticas do projeto, na mesma ordem que o CI (`.github/workflows/ci.yml`) roda:

1. `npm run typecheck` (`tsc -b --noEmit`) — cobre `.ts`/`.tsx` em todo o projeto (main, preload, renderer). É a única correção de tipo que existe hoje, já que o ESLint não cobre `.ts`/`.tsx` ainda (ver `.claude/rules/lint-and-format.md` pro porquê).
2. `npm run lint` (ESLint, flat config) — cobre `.js`/`.mjs`/arquivos de config.
3. `npm run format:check` (Prettier) — cobre o projeto inteiro exceto Markdown.
4. `npm run lint:md` (markdownlint) — cobre todo `.md` do projeto.

Rode os quatro mesmo que a mudança pareça tocar só uma categoria de arquivo — é rápido e evita descobrir um problema só depois no CI.

Se algo falhar:

- **Prettier**: rode `npm run format` pra aplicar automaticamente, depois confira o diff antes de aceitar (principalmente se formatou algo que não devia ter sido tocado).
- **ESLint**: `npm run lint:fix` corrige o que for automático; o resto precisa de edição manual.
- **markdownlint**: geralmente é falta de linha em branco ao redor de título/lista/bloco de código, ou bloco de código sem linguagem declarada — ver `.claude/rules/markdown.md`.
- **typecheck**: nunca ignorar com `@ts-ignore`/`as any` só pra silenciar — entenda a causa raiz do erro de tipo primeiro.

Reporte um resumo do que passou/falhou ao final, não só a saída bruta dos comandos.
