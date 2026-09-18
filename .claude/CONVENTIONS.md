# Convenções de código

## Processo de desenvolvimento

- **Nunca decidir sozinho em algo ambíguo ou com mais de um caminho razoável.** Perguntar antes de escolher, especialmente em decisões de arquitetura, dependências novas, ou qualquer coisa que afete segurança/dados do usuário.
- **Analisar o fluxo e o código existentes antes de alterar qualquer coisa.** Entender o que já existe, como as peças se conectam, e por que estão do jeito que estão antes de propor uma mudança — nunca alterar código sem antes ler e entender o que ele faz e quem depende dele.
- **Sempre montar um plano de implementação antes de mudanças não triviais** (mais de um arquivo, nova dependência, mudança de arquitetura). O plano deve listar o que será tocado e por quê.
- **Sempre revisar o plano com o usuário antes de executar** — não implementar direto a partir da primeira ideia; apresentar o plano, ajustar com o feedback, só então codificar.
- **Sempre testar de verdade depois de implementar** — rodar o app, validar o fluxo completo afetado (não só que o código não quebra, ver funcionando). Ver seção "Testes" abaixo pra como isso é feito neste projeto.
- **REGRA DE BLOQUEIO — nenhuma tarefa está terminada sem a documentação em dia.** Sempre que uma mudança for visível ou relevante pro usuário final (funcionalidade nova, alterada ou removida), a tarefa só é considerada concluída depois de atualizar, na mesma entrega: `CHANGELOG.md` + `docs/releases/vX.Y.Z.md` (ver "Changelog e documentação de release"), o `README.md` quando o texto existente ficar desatualizado ou incompleto por causa da mudança, e a página correspondente em `docs-site/guia/` ou `docs-site/seguranca/` (a documentação pública de uso), publicando-a. "Vou fazer o código agora e a doc depois" não é uma opção válida — é tudo no mesmo commit/entrega. Isso vale mesmo pra ajustes que pareçam pequenos.
- **REGRA DE BLOQUEIO — mudança de arquitetura/código também precisa atualizar a documentação técnica.** Toda vez que uma mudança adicionar um serviço/hook/componente novo, mudar onde uma preferência é guardada, adicionar uma dependência nativa, mudar o protocolo de sala, ou alterar qualquer coisa descrita em `docs-site/tecnico/` (`arquitetura.md`, `mapa-do-codigo.md`, `manutencao.md`, `stack.md`), essas páginas entram na mesma entrega — não é opcional, e não é "documentação de usuário" (regra acima), é documentação de quem vai ler/manter o código depois, inclusive uma sessão futura deste mesmo agente. Uma mudança de arquitetura sem a doc técnica atualizada não está concluída.

## Estilo geral

- **Sem comentários no código (inclusive JSX).** Nomes de variáveis/funções/componentes devem ser autoexplicativos. Exceção: nenhuma — se algo precisar de explicação, é sinal de que o código deveria estar mais claro, não de que precisa de comentário.
- **TypeScript em todo o projeto** (main, preload e renderer/React). `strict: true` sempre ligado. Sem `any` — se o tipo é genuinamente desconhecido, usar `unknown` e refinar.
- Idioma: strings visíveis ao usuário (UI, mensagens de erro, `console.log` de diagnóstico) em **português**. Nomes de variáveis/funções/classes/componentes em **inglês**.
- **Zero duplicação de código (DRY).** Se a mesma lógica ou o mesmo trecho de JSX aparece em dois lugares, extrai pra uma função/hook/componente compartilhado antes de seguir.

## Stack do renderer

- **React + TypeScript + Tailwind CSS**, empacotados com **Vite** (via `electron-vite`). O bundle final (JS/CSS/HTML estáticos) é gerado no build e é isso que o `electron-builder` empacota — não existe mais carregamento direto de `<script type="module">` sem build.
- Bibliotecas de terceiros (PeerJS incluso) são dependências normais do `npm`, importadas como módulo — nada de vendorizar arquivo `.min.js` manualmente como antes.
- `npm run dev` sobe o servidor de desenvolvimento do Vite pra iterar rápido; `npm run build` gera o bundle de produção que o Electron carrega.
- Tipos compartilhados entre `main` e `preload`/`renderer` (formato das mensagens IPC, payload do `get-sources`, etc.) ficam num arquivo só, importado dos dois lados — nunca duas definições de tipo divergentes descrevendo a mesma mensagem.

## Arquitetura em camadas

```text
src/
  main/          processo principal do Electron (window, ipc, ciclo de vida, updater)
  preload/       ponte contextBridge (única forma de o renderer falar com o main)
  renderer/
    src/
      services/    lógica de negócio, SEM tocar em DOM/React (RoomClient, ScreenCapture, room/*)
      hooks/       pontes entre services (EventTarget) e o React (useSyncExternalStore)
      components/  componentes de UI, um por pasta quando tiver subcomponentes
      App.tsx      composition root — o único lugar que monta o layout geral
      main.tsx     ponto de entrada, monta <App /> no DOM
    index.html
```

Regras:

- **`services/` nunca importa nada de `components/` ou `hooks/`.** A dependência é sempre `components/` → `hooks/` → `services/`, nunca o contrário. Serviços continuam expondo estado via eventos (`EventTarget`/`CustomEvent`) — são framework-agnostic de propósito, pra sobreviver a qualquer troca futura de UI.
- Um arquivo cresce demais → divide por responsabilidade, não por tamanho arbitrário. Ver `services/room/` (`MemberRegistry`, `MembershipGossip`, `MediaSharing`, `RoomAuthController`, `peerSession`, `iceDiagnostics`, `turnCredentials`, `videoBitrate`) como referência.
- **Critério objetivo pra saber quando dividir**: liste as responsabilidades distintas da classe/arquivo (uma frase cada — "gerencia X", "decide Y", "converte Z"). Mais de 5-6 responsabilidades claramente diferentes na mesma classe é sinal de dividir, independente de quantas linhas o arquivo tem — um arquivo pequeno também pode estar fazendo coisa demais (ex: `ScreenCapture.ts` tinha só ~67 linhas mas misturava "capturar a tela" com "ajustar bitrate de uma conexão WebRTC já aberta", duas responsabilidades de natureza diferente; virou `ScreenCapture.ts` + `services/room/videoBitrate.ts`). Da mesma forma, `RoomClient.ts` chegou a concentrar autenticação, checagem de versão, aprovação manual de entrada, moderação, watch/unwatch e agregação de eventos de 5 sub-serviços na mesma classe — o handshake/versão/aprovação de entrada saiu inteiro pra `RoomAuthController.ts`, deixando `RoomClient` como o que ele deveria ser: um orquestrador fino que delega, não que implementa tudo.
- Ao criar um `service` novo que precisa de algo do processo `main` (ex: versão do app via IPC), **injete a dependência via parâmetro do construtor com um valor padrão**, nunca chame `window.api.*` direto no meio do corpo da classe — isso mantém a dependência explícita e a classe testável/substituível.

## Componentes React (SOLID + Clean Code aplicado)

- **Um componente, uma responsabilidade.** Se um componente decide lógica de negócio E desenha UI complexa E gerencia efeitos colaterais, ele está fazendo coisa demais — separa em hook (lógica) + componente (apresentação).
- **Componentes "burros" (apresentação) vs "espertos" (conectados).** Componentes de apresentação só recebem props e retornam JSX, sem chamar hooks de serviço diretamente. Componentes conectados (geralmente o de nível mais alto de uma feature) chamam os hooks e passam os dados pra baixo via props.
- **Pasta por componente quando ele tem subcomponentes ou estado próprio complexo:**

  ```text
  components/
    ParticipantTile/
      ParticipantTile.tsx
      VolumeControl.tsx
      index.ts
  ```

  Componente simples e sem subcomponente fica solto em `components/NomeDoComponente.tsx`, sem pasta.

- **A regra acima vale por família, não por arquivo isolado.** Se um grupo de componentes só existe pra servir um componente "dono" (ex: `ShareControls` que renderiza `ShareIdleTrigger`, `ShareSourcePicker`, `ShareActiveStatus`, `SourceGrid`), todos esses arquivos entram na pasta do componente dono — mesmo que cada um individualmente não tenha subcomponente próprio. **Antes de adicionar um novo arquivo solto num diretório que já tem uma pasta de componente com nome parecido (ex: criar `Foo.tsx` num diretório que já tem `FooBar/`), pare e avalie se ele pertence dentro dessa pasta.** Um diretório de componentes com muitos arquivos soltos misturados com pastas é sinal de que uma família não foi agrupada — corrija movendo pra dentro da pasta do componente dono, não deixe acumular.
- **Nome do arquivo = nome do componente**, em PascalCase (`RoomHeader.tsx`, não `room-header.tsx`).
- **Composição em vez de configuração excessiva** (Open/Closed) — um componente que precisa de variações usa `children`/slots, não uma lista crescente de props booleanas (`showX`, `showY`, `variant1`, `variant2`...).
- **Nenhum componente importa outro componente de feature diferente diretamente pra reaproveitar um pedacinho de JSX** — se dois componentes precisam do mesmo pedaço, esse pedaço vira um terceiro componente compartilhado (`components/shared/` ou junto do que for mais específico).
- Estado que vem dos `services/` (sala, sharing, membros) é sempre lido via hook customizado (`useRoom()`, `useParticipants()`, etc.), nunca com `useEffect` + `addEventListener` manual espalhado pelos componentes — o hook encapsula isso uma única vez.
- **Um `return` por componente.** Nada de `if (...) return X; return Y;` no corpo da função. Se um componente tem dois estados visuais distintos (ex: "carregando" vs "carregado", "vazio" vs "com itens"), cada estado vira seu próprio subcomponente, e o componente pai faz **um único** `return` com expressão condicional escolhendo qual subcomponente renderizar:

  ```tsx
  export function ParticipantsView({ members, onToggleWatch }: ParticipantsViewProps) {
    return members.length === 0 ? <EmptyParticipantsState /> : <ParticipantsGrid members={members} onToggleWatch={onToggleWatch} />;
  }
  ```

  Isso força cada subcomponente a ter uma responsabilidade única de verdade, em vez de um componente que "decide e desenha" duas coisas diferentes.

## Tipos

- **Todo componente com props tem um `<Componente>.types.ts` ao lado**, exportando a(s) `interface`/`type`. O `.tsx` só importa o tipo (`import type { RoomHeaderProps } from './RoomHeader.types'`) — nunca declara a interface de props inline no mesmo arquivo do componente.
- Props sempre com `interface` nomeada, nunca props inline sem tipo nem `React.FC` (prefira função nomeada com o tipo de retorno inferido).
- **Props mínimas e específicas** (Interface Segregation) — nunca passar um objeto gigante "config" quando o componente só usa 2 campos dele.
- Tipos de domínio usados por mais de um componente/hook (ex: o formato de uma mensagem do protocolo de sala) ficam no arquivo do serviço dono do domínio (ex: `services/RoomClient.ts` exporta `RoomClientEventDetail`) — só tipos exclusivos de UI (props de componente) é que vão em `.types.ts` ao lado do componente.

## Enums e constantes nomeadas (nunca valor mágico)

- Todo valor com significado especial (chave de resolução/fps, modo de áudio, status de sala, timeout, tamanho de retry) é um `enum` ou uma constante nomeada em `src/renderer/src/constants/`, nunca uma string/número solto repetido pelo código.
- Exemplo: `enum Resolution { HD = '1280x720', FULL_HD = '1920x1080', ... }` em vez de comparar com a string `'1920x1080'` em vários lugares. O rótulo exibido ao usuário ("1080p") fica num `Record<Resolution, string>` ao lado do enum, nunca dentro do componente.
- Timeouts, número de tentativas de retry, intervalos de polling — tudo nomeado em `constants/timing.ts` (`ICE_CONNECTION_TIMEOUT_MS`, etc.), nunca `10000`/`1500`/`4` soltos no meio da lógica.
- **Isso vale em `services/`, não só em componentes.** Uma auditoria já encontrou `minWidth: 320`/`minHeight: 240` soltos em `ScreenCapture.ts`, um `5` solto num `for` de retry em `RoomClient.ts`, e o alfabeto/tamanho do código de sala escritos na mão dentro de `peerSession.ts` — nenhum desses é "código de UI", mas todos são valores de domínio e violam a regra do mesmo jeito. **Antes de considerar qualquer lógica de negócio pronta, releia a função procurando por número/string literal que não seja `0`, `1`, `-1` ou índice de loop puro — se achar, vira constante nomeada antes de finalizar, não depois.**

## Strings visíveis ao usuário

- Toda string mostrada na interface (texto de botão, label, placeholder, mensagem de erro/status) vive em `src/renderer/src/strings/`, um arquivo por área (`preRoom.strings.ts`, `room.strings.ts`, `participants.strings.ts`, etc.), exportando um objeto `as const`. O componente importa e usa `ROOM_STRINGS.startSharingButton`, nunca o texto solto dentro do JSX.
- Mensagens que precisam de interpolação (ex: um erro com o motivo) viram uma função dentro do objeto de strings (`captureError: (reason: string) => \`Erro ao capturar a tela: ${reason}\``), não concatenação montada no componente.
- **`new Error('texto solto')` dentro de um `service/` é a mesma violação, só que disfarçada** — se a mensagem de erro acaba chegando à tela (via `errorMessage(error)` num formulário, por exemplo), ela é uma string visível ao usuário e pertence a `strings/`, igual qualquer label de botão. Uma auditoria já encontrou várias em `RoomClient.ts`, incluindo uma duplicada em dois lugares diferentes (violando DRY) por não estar centralizada. Antes de escrever `new Error(...)` ou `throw new Error(...)`, pare e pergunte: essa mensagem pode chegar à UI? Se sim, vira entrada em `strings/` primeiro.

## Efeitos sonoros

- **Toda ação clicável relevante do app deve ter um som próprio** — é parte da fidelidade à estética retrô Windows 98/ICQ que o projeto persegue, não um extra opcional. Ao adicionar um botão, campo, transição de tela ou qualquer interação nova, perguntar "que som toca aqui?" faz parte do trabalho, no mesmo espírito de "toda string visível vira entrada em `strings/`".
- **REGRA DE BLOQUEIO — nenhum som pode ser reaproveitado pra representar uma ação com significado diferente de outra que já tem som.** Cada ação distinta (abrir uma tela, cancelar um formulário, selecionar uma opção, mudar um campo, iniciar/editar/parar algo) precisa do seu próprio arquivo de áudio, gerado com timbre/frequência/envelope diferente de todos os outros já existentes em `src/renderer/src/assets/sounds/`. **Nunca** copiar/religar um `play*Sound()` já existente pra uma ação nova só porque "é parecido" — a única exceção aceitável é quando a mesma ação, literalmente a mesma semântica, se repete em telas diferentes (ex: o botão "Voltar" existe em várias telas mas representa sempre a mesma coisa — nesse caso um único `playBackButtonSound()` reaproveitado é correto; já "cancelar a configuração de compartilhamento" e "cancelar a exclusão de uma mensagem" são ações diferentes e cada uma tem o seu próprio som).
- Sons vivem centralizados em `src/renderer/src/services/soundEffects.ts`: cada `.wav`/`.mp3` importado de `assets/sounds/` tem uma função exportada `playXSound()` que já aplica o volume configurado pelo usuário (`getSoundEffectsVolume()`). Componentes nunca tocam `new Audio(...)` direto — sempre importam e chamam a função do serviço.
- Antes de criar um som novo, **conferir a lista de imports em `soundEffects.ts`** pra não duplicar por engano uma ação que já tem som com outro nome.
- Sons são sintetizados via script Python (`wave`/`struct`/`math`, tons senoidais/triangulares/quadrados/dente-de-serra com envelope de ataque/liberação, às vezes sequências de 2-3 notas) — não são baixados de banco de sons externo, mantendo a filosofia do projeto de não depender de rede além do broker PeerJS. Variar forma de onda, frequência, duração e formato do envelope entre sons novos é o que garante que nenhum soe parecido com outro.

## Tailwind

- **Nenhum valor arbitrário solto em classe** (`bg-[#0c0e1a]`, `w-[46px]`, `text-[13px]`, `shadow-[...]`). Todo valor usado gira token nomeado em `theme.extend` no `tailwind.config.js` (`colors`, `spacing`, `fontSize`, `borderRadius`, `boxShadow`, `maxHeight`) — só usar um valor arbitrário na primeira vez que aparece é aceitável enquanto se decide o nome, mas antes de terminar a tarefa ele vira token configurado.
- Nomes de token são **descritivos do papel**, não do valor (`titlebar-height`, não `h-38`; `input-bg`, não `custom-dark`).
- **Componentes com variantes usam `tailwind-variants`** (`tv({...})`), num arquivo `<Componente>.variants.ts` separado do `.tsx` — o componente só importa e chama a função de variante, nunca monta a lógica de classes condicionais na mão dentro do JSX.
- Classes condicionais fora do escopo de uma variante formal usam `clsx`, nunca concatenação manual de string.

## Nomes (Clean Code)

- **Nunca abreviar.** `peerConnection`, não `pc`. `event`, não `e`/`evt`. `error`, não `err`. `member`, não `m`. `source`, não `s`. Exceção só pra índice de loop convencional (`for (let i = 0; ...)`), que não gera ambiguidade nenhuma.
- Nome do que a coisa **é ou faz**, nunca abreviação por economia de digitação — o código é lido muito mais vezes do que é escrito.

## Formulários

- Formulário com mais de um campo usa **React Hook Form + Zod** (`@hookform/resolvers/zod`): schema de validação em `<Componente>.schema.ts`, tipos inferidos do schema (`z.infer<typeof schema>`), nunca `useState` por campo controlado na mão.

## Imports

- Alias configurados em `electron.vite.config.ts` **nos três processos** e espelhados em `tsconfig.node.json`/`tsconfig.web.json`: `@shared/*` → `src/shared/*` (main/preload/renderer); `@main/*` → `src/main/*` (só main); `@/*` → `src/renderer/src/*` (só renderer).
- **Regra sem exceção: todo import usa o alias, inclusive entre arquivos irmãos na mesma pasta.** Nunca `./Card.types`, sempre `@/components/Card/Card.types`; nunca `./window`, sempre `@main/window`. Não existe distinção entre "sobe uma pasta" e "é vizinho" — isso elimina qualquer dúvida na hora de escrever o import e faz o arquivo sobreviver a ser movido de pasta sem quebrar silenciosamente, já que o caminho nunca depende de onde o arquivo que importa está.
- **Única exceção legítima:** um import de efeito colateral sem `from` (ex: `import '@/index.css';` num arquivo de entrada). Mesmo esse caso usa o alias quando possível — a exceção é só pra quando o alvo não é um módulo JS/TS importável por caminho (raríssimo neste projeto).

## Formatação e lint

- **Prettier formata o projeto inteiro** (config em `.prettierrc.json`: aspas simples, ponto e vírgula, 140 colunas, sem vírgula sobrando no último item). `npm run format` aplica, `npm run format:check` só confere (é o que o CI roda). Markdown fica de fora (`.prettierignore`) — quem cuida de `.md` é o `markdownlint` (`npm run lint:md`), pra não ter dois donos da mesma formatação.
- **ESLint** (`eslint.config.mjs`, flat config) cobre hoje só `.js`/`.mjs`/config files — **`.ts`/`.tsx` ficam de fora de propósito**, porque o projeto usa TypeScript 7.x (a versão `latest` real no momento, não uma escolha errada) e `typescript-eslint` ainda não suporta essa versão (nem a build alpha mais recente dela suporta — checado direto no registro do npm antes de decidir). **Nunca rebaixar o TypeScript do projeto só pra fazer o ESLint funcionar** — a solução certa é esperar `typescript-eslint` publicar suporte e então estender `eslint.config.mjs` pra cobrir `.ts`/`.tsx` (idealmente com `typescript-eslint` recomendado + `eslint-plugin-react-hooks`, sem o conjunto `strict-type-checked`). Enquanto isso, `.ts`/`.tsx` continuam cobertos pelo `tsc` (`npm run typecheck`) pra correção de tipo, só não têm as regras de qualidade do ESLint.
- Ao checar se uma dependência de tooling suporta uma versão nova de outra dependência, **checar direto no registro do npm** (`npm view <pacote> versions`/`dist-tags`), nunca assumir pelo que "parece familiar" de treinamento — já aconteceu de uma sugestão errada (rebaixar TypeScript por achar que 5.x ainda era a versão atual) ser corrigida só depois do usuário perguntar "você está usando versões estáveis de [ano atual]?".

## Electron / segurança

- `contextIsolation: true`, `nodeIntegration: false` sempre. Toda comunicação main↔renderer passa pelo `preload.js` via `contextBridge`.
- Nunca usar `eval`, nunca desabilitar sandboxing sem motivo documentado no `CLAUDE.md`.
- Flags de linha de comando do Chromium (`app.commandLine.appendSwitch`) só devem ser adicionadas com uma justificativa clara e testada em mais de uma versão do Windows quando possível — ver histórico de bugs no `CLAUDE.md` antes de mexer nisso.

## Testes

- Não existe suite de testes automatizada formal. Validação é feita rodando o app de verdade via Playwright (`playwright-core`) contra o Electron empacotado, sob `xvfb-run`, simulando duas instâncias quando o teste envolve a sala/P2P.
- Sempre que uma mudança tocar em `RoomClient`/sala, testar o fluxo completo: criar sala → entrar com código → compartilhar tela → assistir — não só que o código não quebra, mas que a UI reflete o estado corretamente nos dois lados.

## Build e releases

- **O instalador Windows (NSIS) NUNCA é compilado localmente no WSL/Linux** — isso exigiria Wine, que foi descartado deliberadamente (ver `CLAUDE.md`). A compilação acontece só via GitHub Actions, numa máquina Windows real (`.github/workflows/release.yml`), disparada por push de uma tag `vX.Y.Z`.
- Fluxo pra publicar uma nova versão:
  1. Atualizar `version` no `package.json`.
  2. Criar `docs/releases/vX.Y.Z.md` com o detalhamento da versão (tabelas de Adicionado/Alterado/Corrigido).
  3. Adicionar uma linha na tabela-índice do `CHANGELOG.md` na raiz, linkando pro arquivo acima.
  4. Commitar tudo.
  5. Criar a tag: `git tag vX.Y.Z` e `git push --tags` (junto com o push normal).
  6. O GitHub Actions compila o instalador e publica em Releases automaticamente — o app já embutido com `electron-updater` detecta a nova versão sozinho.
- `npm run dist:local` gera a pasta portátil de teste (`dist/win-unpacked`, target `dir`, sem edição de recursos do `.exe`) localmente no WSL, sem precisar de Wine — útil pra testar rápido sem esperar o CI. Essa pasta NÃO é o artefato de release oficial. `npm run dist` (sem `:local`) é o comando usado pelo CI e tenta compilar o NSIS de verdade — **não rodar esse localmente no WSL**, vai pedir Wine.

## Changelog e documentação de release

- `CHANGELOG.md` na raiz é só uma **tabela-índice** (versão + resumo de uma linha). Nunca colocar o detalhamento ali.
- O detalhamento completo de cada versão (o que foi feito, por quê, tabelas de mudanças) vai em `docs/releases/vX.Y.Z.md`, um arquivo por versão.
- **`CHANGELOG.md` e `docs/releases/` são só sobre o app** (features, correções, mudanças visíveis pra quem usa). **Nunca mencionar `CLAUDE.md`, `CONVENTIONS.md`, reorganização de convenções, processo interno de desenvolvimento ou qualquer coisa sobre como o código foi escrito** — isso é conteúdo interno, não faz parte do histórico de versões do produto.

## Markdown

Todo arquivo `.md` do projeto deve passar em `npm run lint:md` (markdownlint, config em `.markdownlint.json`) antes de commitar. A regra de tamanho de linha (MD013) está desativada — todas as outras valem. Pra não depender de rodar o lint pra descobrir erro, siga isso ao **escrever** o arquivo, não só ao revisar:

- **Título só uma vez por arquivo**, na primeira linha, com `#`. Seções internas usam `##`, `###` etc, nunca pulando nível (não ir de `#` direto pra `###`).
- **Sempre uma linha em branco antes e depois de qualquer título**, tabela, lista ou bloco de código. Nunca título colado no texto/tabela seguinte.
- **Todo bloco de código (` ``` `) tem que declarar a linguagem** — `text`, `js`, `json`, `bash`, etc. Nunca ` ``` ` sozinho.
- **Tabelas sempre no estilo espaçado**, com espaço depois de cada `|`:

  ```text
  | Coluna A | Coluna B |
  | --- | --- |
  | valor 1 | valor 2 |
  ```

  Nunca compacto (`|---|---|`, sem espaços).

- **Listas**: um espaço depois do marcador (`- item`, não `-item`), e uma linha em branco antes/depois do bloco inteiro da lista (não precisa entre os itens da lista em si).
- **Um único `#` (título de nível 1) por arquivo**, sempre a primeira linha do arquivo — sem linha em branco nem texto antes dele.
- Arquivo sempre termina com **uma única quebra de linha final** (sem linhas em branco extras no fim, sem faltar a última quebra).
- Antes de considerar qualquer `.md` pronto, rodar `npm run lint:md` e não deixar nenhum erro pendente — isso é a validação final, não o único mecanismo.

## Commits

- Formato **Conventional Commits** (estilo Commitizen): `tipo(escopo): descrição curta`, seguido de um corpo detalhado explicando o quê e o porquê.
- Tipos usados: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `perf`, `build`, `ci`.
- **Sempre em português**, mensagem curta e corpo incluídos.
- **Nunca usar Claude/IA como co-autor do commit**, nem qualquer menção a ferramentas de IA na mensagem — este é um repositório público e essa é uma decisão deliberada do autor.
