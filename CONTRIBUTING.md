# Contribuindo com o ZeroHop

Contribuições são muito bem-vindas: correções, melhorias, novas funcionalidades ou só apontar um bug.

- Abra uma [issue](https://github.com/murilobarbosa2002/zerohop/issues) descrevendo o problema ou a ideia.
- Ou mande direto um [pull request](https://github.com/murilobarbosa2002/zerohop/pulls) com a alteração.

Se você quer ir num caminho diferente do que este projeto toma, ou simplesmente quer ter o controle total da sua própria versão, não peça: **faça um fork e divulgue.** É o caminho mais incentivado aqui, não um plano B (veja a seção "Contribuições" do [README](README.md) para o contexto completo dessa ideia).

## Rodando em modo desenvolvimento

```bash
npm install
npm run dev
```

Isso abre o app com hot-reload. `npm run typecheck` roda a checagem de tipos (`tsc -b --noEmit`) e `npm run build` gera o bundle de produção em `out/`.

## Rodando os testes

```bash
npm run test:e2e
```

Isso builda o app e roda a suíte de testes end-to-end (`e2e/`) contra o binário real do Electron, via Playwright + Xvfb.

## Convenções de código

- TypeScript estrito, sem `any` solto.
- Tailwind CSS só com os tokens já configurados no tema — nada de valor solto (cor, espaçamento, etc. direto na classe).
- Zero comentário no código, salvo quando algo realmente não é óbvio (uma decisão não intuitiva, uma limitação conhecida).
- Textos de interface centralizados nos arquivos `src/renderer/src/strings/*.ts`, nunca direto no JSX.
- Commits em português, seguindo [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`, etc.).

## Issue ou pull request?

Abra uma issue quando quiser discutir uma ideia antes de implementar, ou só reportar um bug. Mande um pull request direto quando já tiver a mudança pronta, pequena e testada.

## Conduta e segurança

Participar deste repositório (issues, pull requests, discussões) pressupõe seguir o [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Encontrou uma vulnerabilidade de segurança em vez de um bug comum? Veja o [SECURITY.md](SECURITY.md) antes de abrir uma issue pública.
