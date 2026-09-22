---
paths:
  - "**/*.md"
---

# Markdown

Todo arquivo `.md` do projeto deve passar em `npm run lint:md` (markdownlint, config em `.markdownlint.json`) antes de commitar. A regra de tamanho de linha (MD013) está desativada — todas as outras valem. Siga isso ao **escrever**, não só ao revisar:

- **Título só uma vez por arquivo**, na primeira linha, com `#`. Seções internas usam `##`, `###` etc, nunca pulando nível.
- **Sempre uma linha em branco antes e depois de qualquer título**, tabela, lista ou bloco de código.
- **Todo bloco de código (` ``` `) tem que declarar a linguagem** — `text`, `js`, `json`, `bash`, etc.
- **Tabelas sempre no estilo espaçado**, com espaço depois de cada `|`:

  ```text
  | Coluna A | Coluna B |
  | --- | --- |
  | valor 1 | valor 2 |
  ```

- **Listas**: um espaço depois do marcador (`- item`, não `-item`), e uma linha em branco antes/depois do bloco inteiro da lista.
- Arquivo sempre termina com **uma única quebra de linha final**.
- Antes de considerar qualquer `.md` pronto, rodar `npm run lint:md` e não deixar nenhum erro pendente.
- **`CHANGELOG.md` e `docs/releases/` são só sobre o app** (features, correções, mudanças visíveis pra quem usa). **Nunca mencionar `CLAUDE.md`, `.claude/rules/`, reorganização de convenções, processo interno de desenvolvimento ou qualquer coisa sobre como o código foi escrito** — isso é conteúdo interno.
