---
paths:
  - "src/renderer/src/components/**/*.tsx"
  - "src/renderer/src/hooks/**"
---

# Histórico de bugs — UI/estado React (não repetir)

- **NUNCA chamar `setState` (ou qualquer função que chame `setState`) de dentro do updater funcional de outro `setState`.** Um updater funcional (`setX(current => ...)`) precisa ser puro — sob `<StrictMode>`, o React invoca esses updaters duas vezes de propósito pra pegar esse tipo de impureza. Padrão obrigatório: um ref espelhando o state (`pendingSessionRef`) + side effects como statements simples fora do updater + `setState(valorPlano)` no final.
- **Duas instâncias do mesmo hook React sem canal de sincronização = estado dessincronizado entre elas.** Se um estado precisa aparecer em mais de um lugar da UI ao mesmo tempo (contador + tela cheia, por exemplo), não pode depender só de mutação local otimista de cada instância de hook — precisa de um evento do main (ou estado elevado/compartilhado) cobrindo TODAS as mutações, não só a criação.
- **Um "early return" baseado num estado que não reflete TODOS os efeitos colaterais da função vai pular efeitos que deveriam rodar sempre.** Ex: `if (sessionId === focusedSessionId) return;` no topo de uma função que também precisa fechar um overlay (que não muda `focusedSessionId`) pulava o fechamento do overlay. Separar "o que sempre deve acontecer" de "o que só deve acontecer se algo mudou".
- **NUNCA calcular o `transform`/centralização de um ícone SVG feito de curvas (arco, bezier) "de cabeça".** Sempre medir o `getBBox()` real no navegador (via `webContents.executeJavaScript` num `BrowserWindow`) antes de calcular o `translate` necessário.
- **`text-on-accent` (cor do texto em botões azuis): valor certo confirmado pelo usuário é `#c9d2e6`, sem `text-shadow`.** Já oscilou várias vezes entre versões por relatos de "parece preto"/"forte demais" que provavelmente eram build desatualizada, não bug de CSS real. Antes de mudar essa cor de novo, pedir confirmação explícita e considerar que o usuário pode estar vendo uma versão antiga.
