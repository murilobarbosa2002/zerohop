# Estilo de código e nomes

- **Sem comentários no código (inclusive JSX).** Nomes de variáveis/funções/componentes devem ser autoexplicativos. Exceção: nenhuma — se algo precisa de explicação, o código deveria estar mais claro.
- **TypeScript em todo o projeto** (main, preload e renderer/React). `strict: true` sempre ligado. Sem `any` — se o tipo é genuinamente desconhecido, usar `unknown` e refinar.
- Idioma: strings visíveis ao usuário (UI, mensagens de erro, `console.log` de diagnóstico) em **português**. Nomes de variáveis/funções/classes/componentes em **inglês**.
- **Zero duplicação de código (DRY).** Mesma lógica ou trecho de JSX repetido em dois lugares → extrair pra função/hook/componente compartilhado antes de seguir.
- **Nunca abreviar.** `peerConnection`, não `pc`. `event`, não `e`/`evt`. `error`, não `err`. `member`, não `m`. `source`, não `s`. Exceção só pra índice de loop convencional (`for (let i = 0; ...)`).
- Nome do que a coisa **é ou faz**, nunca abreviação por economia de digitação — o código é lido muito mais vezes do que é escrito.
