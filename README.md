# ZeroHop

Um app de desktop, gratuito e open source, para compartilhar a tela do PC (jogo, janela ou a tela inteira), conversar por voz e falar com os amigos sem depender de nenhum servidor próprio. É rodar o programa, criar ou entrar numa sala com um código curto, e pronto: vídeo e voz vão direto de um PC para o outro.

Feito por **[Murilo Barbosa](https://github.com/murilobarbosa2002)**.

Este README existe para ser lido tanto por quem programa quanto por quem nunca abriu um editor de código na vida. Se algo aqui não ficar claro, abra uma issue perguntando.

**Documentação completa: [murilobarbosa2002.github.io/electron-screen-share](https://murilobarbosa2002.github.io/electron-screen-share/).** Tem guia de uso, segurança e privacidade em detalhe, arquitetura técnica e perguntas frequentes.

## O que é, em uma frase

Um "Discord de tela compartilhada e chat de voz" que roda sem nenhum servidor pago ou mantido por alguém. Qualquer pessoa pode baixar, ler todo o código-fonte, compilar do zero e confirmar exatamente o que o programa faz, porque tudo o que ele faz está aqui, público, pra qualquer um auditar.

> **Testado só no Windows.** O instalador oficial e todo o uso real até agora foram só em Windows. O app também builda pra Linux (`electron-builder` tem alvo `AppImage` configurado), mas essa build ainda não foi revisada/testada de verdade num Linux de desktop — pode ter comportamento diferente ou problemas ainda não descobertos. Se você testar em Linux e encontrar algo, uma issue ou pull request é muito bem-vindo.

## Por que este projeto existe

Eu e meus amigos jogamos jogos diferentes, muitas vezes cada um no seu, e sempre foi comum compartilhar a tela pra um assistir o jogo do outro ou discutir o que está acontecendo em tempo real. É uma prática banal, sem nada de ilegal ou nocivo. Foi exatamente essa demanda pessoal, simples, que motivou eu escrever este programa.

Só que em 2025 o governo brasileiro determinou a suspensão de recursos de streaming e compartilhamento de tela em plataformas como o Discord, como resposta a casos de crimes cometidos por uma minoria de usuários. O resultado prático dessa medida não foi impedir quem comete crime. Foi tirar uma função básica, corriqueira e inofensiva do dia a dia de **milhões de brasileiros** que nunca fizeram nada de errado.

Isso é, na minha visão, uma medida populista, rasa e tecnicamente mal informada. Não resolve nada do problema real e pune em massa quem não tem culpa nenhuma. Milhões de pessoas não deveriam ter uma ferramenta básica tirada de suas vidas por causa de uma minúscula fração de criminosos, e muito menos por causa da omissão de pais que não educam, não acompanham e não fiscalizam o que os próprios filhos fazem online. Responsabilidade dos pais não é problema de infraestrutura e não deveria virar motivo pra restringir a liberdade digital de todo um país.

E é importante deixar claro: isso nunca foi só sobre jogos. Compartilhamento de tela é uma ferramenta de trabalho básica, usada todos os dias por gente de nichos completamente diferentes que também foi atingida por essa medida sem ter feito nada de errado. Empresas de tecnologia usam o Discord pra dar suporte técnico a plugins, APIs e produtos, compartilhando a tela pra mostrar exatamente onde está o problema. Times inteiros, de startups a squads remotos, organizam o trabalho do dia a dia por servidores do Discord e dependem de compartilhamento de tela pra reunião, alinhamento e revisão de trabalho. E que programador nunca fez um pair programming compartilhando a tela com um colega pra resolver um bug juntos? Uma decisão populista dessas não pune só quem joga. Ela atropela suporte técnico, times de trabalho remoto, educação, programadores e qualquer pessoa que usa essa função de forma completamente legítima, em qualquer ramo.

Este projeto é minha resposta prática a isso: uma ferramenta simples, transparente e livre que devolve essa função básica pra quem só quer usá-la pra jogar com os amigos. Feita por alguém que também é brasileiro, também usa tecnologia todo dia e não aceita negociar liberdade individual em troca de uma canetada que não resolve nada.

E isso não é uma briga ideológica, nem é sobre time político nenhum. Não importa se fosse um governo de direita ou de esquerda, este ou aquele presidente, este ou aquele ministro: se qualquer outra pessoa, de qualquer lado, tivesse tomado exatamente essa mesma medida, este projeto existiria do mesmo jeito. O problema nunca foi quem assinou. Foi a medida em si, rasa, populista e tecnicamente mal informada, venha de onde vier.

E também é por isso que esse tipo de medida importa tanto, mesmo parecendo pequena: aceitar caladinho um pedaço da nossa liberdade digital hoje é abrir precedente pra um pedaço maior amanhã. Não é alarmismo, é como esse tipo de coisa historicamente escala, em qualquer lugar do mundo, sob qualquer governo. Depois que o controle vira normal, reclamar só depois que a coisa já está grande de verdade não adianta mais. Somos brasileiros, não somos cubanos nem venezuelanos, e nossa liberdade individual não tem preço nem deve ser negociada aos pedacinhos em nome de nenhuma boa intenção. Isso dito, essa comparação é sobre modelo de controle estatal, nunca um ataque ao povo cubano ou ao povo venezuelano: são nossos vizinhos, e o problema nunca é o povo de lugar nenhum, é sempre quem concentra poder demais sobre a vida dos outros.

**Deixando bem claro (disclaimer):** este projeto não apoia, não incentiva e não foi feito para nenhum tipo de crime virtual, e eu, como autor, não sou responsável pelo uso que qualquer pessoa fizer dele. Ele foi criado para uso pessoal, entre amigos, para uma necessidade legítima e comum. Software é neutro: quem usa mal qualquer ferramenta é responsável pelo próprio uso, e isso vale pra qualquer programa, navegador ou aplicativo que existe. E isso não é só discurso: **não existe servidor, não existe coleta de dados, não existe nada passando por mim.** É uma conexão P2P direta entre você e seus amigos, ponto. Voltando pra internet raiz: duas máquinas conversando direto entre si, sem intermediário nenhum guardando ou vendo nada.

## Transparência como princípio

Este projeto é 100% open source e assim vai continuar. Todo o código está aqui, público, pra qualquer pessoa ler, auditar, questionar e confirmar linha por linha o que o programa realmente faz. Não existe nenhuma parte escondida, nenhum servidor por trás coletando nada, nenhuma telemetria oculta.

É através de transparência real e código aberto que se constrói confiança de verdade na tecnologia. É assim que ajudamos a construir um mundo digital mais livre e mais honesto, não com decisões impostas de cima pra baixo por quem nunca escreveu uma linha de código na vida.

## Livre para qualquer um, sem restrição

Este projeto é licenciado sob [MIT](LICENSE), a licença mais permissiva que existe. Isso significa, na prática:

- Você pode **usar** para o que quiser.
- Você pode **modificar** o código à vontade.
- Você pode **empacotar e distribuir** sua própria versão.
- Você pode **criar seu próprio fork** e divulgar.
- Você pode usar até comercialmente, sem pedir permissão.

Nenhuma canetada de político vai ser maior que a tecnologia. Se um caminho for fechado, a comunidade abre outro. É assim que open source funciona, e é assim que este projeto pretende continuar existindo, não importa o que mude.

Quem quiser usar minha versão do jeito que ela está, ótimo, fique à vontade. Mas o foco de verdade é a criação de forks: pegue o código, leve pro seu rumo, resolva a sua própria necessidade. **Criem forks.** Um projeto que se multiplica em várias versões diferentes, mantidas por gente diferente, é muito mais resistente do que um projeto único dependendo de uma pessoa só.

## Expectativas sobre o projeto

Sendo direto: **não espere um roadmap grande, releases frequentes ou novas features chegando toda hora.** Este projeto nasceu de uma demanda pessoal minha e dos meus amigos, resolve exatamente o que a gente precisava, e é isso. Eu mexo nele quando surge uma necessidade real do nosso uso, não por obrigação de manter um produto.

Mas justamente por ser open source, ele é seu tanto quanto é meu: está tudo aí, público, livre pra você usar, modificar, ampliar e fazer o que quiser, inclusive construir a "grande feature" que eu talvez nunca vá construir. Veja a seção "Contribuições" abaixo.

## Contribuições

Contribuições são super bem-vindas, sejam correções, melhorias, novas funcionalidades ou só apontar um bug. Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para como rodar o projeto localmente, rodar os testes e as convenções de código.

Mas se você quer ir num caminho diferente do que este projeto toma, ou simplesmente quer ter o controle total da sua própria versão, não peça: **faça um fork e divulgue.** É o caminho mais incentivado aqui, não um plano B. Quanto mais forks diferentes existirem por aí, mais forte e mais difícil de calar essa ideia fica.

## Como funciona

O compartilhamento de vídeo, áudio e voz é sempre **direto entre os PCs** (WebRTC, ponto a ponto). Nada disso passa por nenhum servidor. A única coisa que passa por um serviço externo é a etapa inicial de "apresentação" entre os participantes (saber quem está na sala e trocar os dados técnicos necessários pra abrir a conexão direta), feita através do broker público e gratuito do [PeerJS](https://peerjs.com/).

1. Ao abrir o app, uma pessoa escolhe **Criar sala nova**, digita o nome dela e define uma **senha** (obrigatória, toda sala nasce protegida). Isso gera um código curto (6 caracteres).
2. Ela compartilha o código **e** a senha com os amigos por onde quiser (WhatsApp, Discord, etc).
3. Cada amigo abre o app, escolhe **Entrar numa sala** e digita nome, código e a senha recebida.
4. O microfone de todo mundo já liga sozinho: quem quiser compartilhar a tela clica em compartilhar, quem quiser assistir escolhe quem quer ver.

O vídeo só é enviado para quem pede explicitamente pra assistir. Ninguém recebe o stream de todo mundo o tempo todo, o que economiza a banda de quem está compartilhando.

Se a conexão direta cair ou demorar demais pra abrir, o app tenta reconectar automaticamente algumas vezes sozinho, sempre tentando de novo uma conexão direta, nunca caindo pra um servidor de relay.

## Segurança e privacidade

Transparência total sobre o que este projeto protege e o que ele não protege:

- **Vídeo, áudio e as mensagens internas da sala são criptografados ponta a ponta**, nativamente pelo WebRTC (DTLS-SRTP). Isso é garantido pelo próprio protocolo, não é uma feature que este app precisou implementar. Mas também significa que ninguém no meio do caminho, nem o broker de sinalização, consegue ler o conteúdo.
- **O broker público do PeerJS (`0.peerjs.com`) é um serviço de terceiro**, fora do controle deste projeto. Ele só enxerga metadados necessários pra apresentar os participantes uns aos outros (por exemplo, quem está tentando se conectar com qual código de sala), nunca o conteúdo de vídeo, áudio ou das mensagens.
- **O código da sala funciona como um convite, não como uma senha.** Ele tem entropia razoável (mais de 1 bilhão de combinações), mas se vazar (por exemplo, sendo encaminhado sem querer), qualquer pessoa com ele poderia tentar entrar. Por isso **toda sala exige uma senha** (definida obrigatoriamente por quem cria): ninguém entra sem digitar exatamente a mesma senha, mesmo sabendo o código.
- **Só quem criou a sala pode remover alguém dela.** Ao remover, a conexão com essa pessoa é encerrada nos dois sentidos e ela é bloqueada de reconectar sozinha na mesma sessão.
- **Mesmo com a senha certa, quem criou a sala precisa aprovar manualmente cada pessoa que entra.** Um pop-up aparece pra quem criou a sala a cada tentativa de entrada, com o nome de quem está pedindo e a opção de aceitar ou recusar, uma camada a mais de controle além da senha.
- **Toda mensagem trocada entre os participantes é validada contra um formato esperado** antes de ser processada. Uma mensagem malformada ou fora do protocolo é descartada, nunca executada.
- **Não existe servidor de relay (TURN).** Não existe um "atalho" escondido pelo qual o tráfego de alguém possa passar sem você saber. A conexão é sempre direta entre os PCs, ou simplesmente não acontece.
- **O chat de texto da sala nunca é salvo em lugar nenhum**, nem em disco, nem em `localStorage`, nem em nenhum servidor. As mensagens existem só na memória RAM do processo enquanto você está na sala, exatamente como o vídeo, áudio e voz compartilhados, e trafegam direto entre os PCs pela mesma conexão criptografada (DTLS) do resto do protocolo. Não existe um "servidor de mensagens" no meio.
- **Não existe um evento único de "a sala inteira fechou".** Como é uma rede em malha sem servidor central, não há uma autoridade que declare isso pra todo mundo ao mesmo tempo. O que existe é, por pessoa: ao clicar em "Sair da sala" ou fechar o app, o seu histórico de chat é apagado da memória do seu processo imediatamente, e como ele nunca existiu em nenhum outro lugar, isso já é definitivo. Quando todo mundo sai, a sala simplesmente deixa de existir na prática.
- **Nenhuma telemetria, nenhuma coleta de dados, nenhum analytics.** Todo o código está neste repositório pra qualquer pessoa auditar e confirmar isso por conta própria.

## Com o que foi feito

- **[Electron](https://www.electronjs.org/)**: o app roda como um programa de desktop nativo (Windows), não um site.
- **[React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)**: toda a interface e a lógica do programa.
- **[Tailwind CSS](https://tailwindcss.com/)**: estilo visual.
- **[Vite](https://vitejs.dev/)** (via [electron-vite](https://electron-vite.org/)): empacotamento do código.
- **[PeerJS](https://peerjs.com/)** sobre **WebRTC**: conexão direta de vídeo, áudio e voz entre os PCs, sem servidor de mídia.
- **[electron-updater](https://www.electron.build/auto-update)**: atualização automática do app via GitHub Releases.
- **GitHub Actions**: o instalador Windows é compilado automaticamente, num runner Windows real e gratuito, a cada nova versão.

Todo o código é público neste repositório. Não existe binário fechado nem parte proprietária escondida.

## Rodar em modo desenvolvimento

```bash
npm install
npm run dev
```

## Gerar o instalador

```bash
npm run build
npm run dist
```

O instalador oficial (Windows) é sempre gerado via GitHub Actions, a cada tag de versão publicada. Veja `.github/workflows/release.yml`.

## Solução de problemas

### "O Windows protegeu o computador" / "Fornecedor desconhecido" ao instalar

Isso é esperado e não significa que o programa tem vírus ou é malicioso. É o **Microsoft Defender SmartScreen**, um filtro do Windows que avisa sobre qualquer instalador que ainda não acumulou reputação suficiente na base da Microsoft. Isso acontece com **qualquer** programa novo, independentemente de quem fez, quando ele não paga por um certificado de assinatura de código (um selo digital emitido por empresas como a DigiCert, que custa uma assinatura anual).

Este projeto é gratuito e sem fins lucrativos, então não existe esse certificado pago, e é exatamente por isso que aparece "Fornecedor desconhecido": o Windows não tem como confirmar automaticamente quem publicou o instalador. Isso não significa que o instalador foi comprometido, só que a Microsoft não foi paga pra "confirmar" o autor.

Se você confia na fonte (baixou direto da [página de Releases do repositório oficial no GitHub](https://github.com/murilobarbosa2002/electron-screen-share/releases), não de um link de terceiro), pode seguir com a instalação:

1. Clique em **"Mais informações"** na primeira tela do aviso.
2. Vai aparecer um botão **"Executar assim mesmo"**. Clique nele.

Se quiser confirmar por conta própria que o instalador é exatamente o que foi compilado a partir deste código-fonte público, sem confiar apenas na nossa palavra, o processo de build inteiro é público e auditável em `.github/workflows/release.yml`. Qualquer pessoa pode reproduzir o mesmo build a partir do mesmo commit.

### "Meu amigo não consegue entrar na minha sala"

Na grande maioria dos casos isso não é um bug do app. É a rede ou o antivírus de alguém bloqueando a conexão direta (WebRTC usa tráfego UDP, que redes mais restritas às vezes barram). Um passo a passo simples pra descobrir o motivo:

1. **Confirme que os dois digitaram exatamente o mesmo código e a mesma senha.** Um espaço a mais ou letra trocada já impede a conexão, e por design ninguém recebe um aviso "senha errada" explícito (isso evitaria que um estranho ficasse tentando adivinhar).
2. **Verifique se algum antivírus de terceiro está instalado** (ESET, Avast, Norton, Kaspersky, etc). Muitos desses programas **gerenciam o Firewall do Windows por baixo dos panos**, ou seja, adicionar uma exceção pela tela nativa do "Firewall do Windows Defender" não resolve nada, porque quem está decidindo bloquear ou não é o antivírus, não o Windows. Nesse caso, a exceção/regra de permissão de rede precisa ser criada **dentro do próprio antivírus** (geralmente numa seção chamada "Firewall", "Proteção de rede" ou "Regras de aplicativo").
3. **Se estiver numa rede corporativa, escolar ou de local público** (faculdade, empresa, evento), é comum que tráfego UDP peer-to-peer seja bloqueado de propósito pela própria rede. Nesse caso, tente numa rede doméstica comum.
4. **Abra a tela de Logs dentro do próprio app** (ícone na barra de título, ou dentro da sala na barra do microfone). Cada evento de conexão aparece numa frase simples, com "▸ Detalhes técnicos" pra quem quiser investigar mais fundo, útil pra quem for reportar um problema numa issue.

### Cursor sumindo, imagem travando ou piscando ao compartilhar jogos

Isso acontece com alguns jogos (relatado com Project Zomboid e Deadlock) e tem três sintomas possíveis:

- O jogo em **tela cheia exclusiva** ("Fullscreen" de verdade, não Borderless) não aparece na lista de "Uma janela específica".
- Com o jogo em janela/Borderless, compartilhando **a janela do jogo**, o cursor do mouse some enquanto o jogo está em foco.
- Compartilhando **a tela inteira** com o jogo aberto (janela ou fullscreen), a imagem trava, aparece o cursor padrão do Windows parado no meio da tela em vez do cursor real, e só atualiza um frame quando você troca de janela (Alt+Tab), voltando a travar quase na hora.

**Somos honestos: não temos uma solução completa pra isso.** É uma limitação de como o Windows expõe a tela e as janelas de jogos pra qualquer programa de captura, não só este. É o mesmo tipo de problema que o Discord e o OBS também enfrentam, resolvendo de formas que explicamos abaixo, com trade-offs que decidimos não trazer pra cá.

**O que costuma ajudar, testado do lado do usuário (fora do app):**

1. No atalho/executável do jogo, vá em **Propriedades** → aba **Compatibilidade** e marque **"Desativar otimizações de tela cheia"**.
2. Mantenha o jogo em modo **Borderless/Windowed** (não fullscreen exclusivo).

**O que tentamos disponibilizar, com o risco declarado:** em Configurações existe um interruptor **"Captura otimizada para jogos (experimental)"**, desligado por padrão. Ele faz o app tentar usar a API `Windows.Graphics.Capture` do próprio Windows em vez do método padrão, que foi desenhada pela Microsoft pra lidar melhor com cursor e jogos em tela cheia. O motivo de vir desligada por padrão, e exigir uma confirmação explícita pra ligar, é que **essa API já causou travamento completo do PC em pelo menos um computador testado**, antes mesmo de existir como opção (na época, tentamos ativar isso à força, pra todo mundo, sem interruptor, e não deu certo). Agora é opt-in, uma pessoa por vez, sabendo do risco. Pode resolver seu caso, pode não resolver, pode não fazer diferença nenhuma. Não temos como garantir de antemão, porque o comportamento varia por driver de GPU e versão do Windows. Se ativar e o app parar de abrir, veja "O app não abre mais depois de ativar uma configuração" logo abaixo: dá pra desligar essa opção editando um arquivo de texto, sem precisar abrir o app.

**O que consideramos e decidimos não fazer**, pra deixar claro que pensamos nas alternativas:

- **Captura por injeção direto no processo do jogo** (a técnica que o "Game Capture" do OBS e o compartilhamento de jogo do Discord usam) resolveria o problema de verdade, mas exige injetar uma DLL no processo do jogo, e **muitos sistemas anti-cheat (Vanguard, Easy Anti-Cheat, BattlEye) tratam injeção de código como comportamento de hack**, o que pode gerar alertas ou até banimento em jogos com esses sistemas. O Discord e outras ferramentas grandes (Steam Overlay, GeForce Experience) não têm esse problema porque estão em listas de exceção negociadas diretamente com essas empresas de anti-cheat, algo que um projeto pessoal e gratuito como este não tem como conseguir. Julgamos que o risco pro usuário (banimento numa conta de jogo) é grande demais pra valer a pena.

Se você entende de captura de tela no Windows e sabe de uma solução real pra isso, seja uma configuração que não pensamos, uma forma mais segura de usar WGC, ou qualquer outra ideia, **ficaríamos muito felizes em receber uma contribuição** (issue ou pull request). É bem possível que estejamos enxergando esse problema errado ou incompleto. Este texto reflete o que sabemos até agora, não a última palavra.

### Compartilhando "Tela inteira" e a imagem fica preta pra sempre depois de usar o Recorte (Win+Shift+S)

Usar a ferramenta de Recorte do Windows (ou o Print Screen básico) enquanto compartilha a tela inteira pode deixar a imagem presa em preto, sem voltar sozinha, mesmo esperando. Não é o mesmo problema dos jogos acima: o gatilho aqui é o overlay de escurecer a tela que o Recorte usa, que parece invalidar a sessão de captura do navegador por baixo dos panos.

Não conseguimos detectar isso de forma confiável dentro do app (o vídeo continua tecnicamente "ativo", só entregando frames pretos), então não existe um aviso automático pra esse caso específico ainda. **A solução é simples: clique em "Parar de compartilhar" e depois em "Compartilhar minha tela" de novo.** Isso força uma sessão de captura nova e resolve.

### O app não abre mais depois de ativar uma configuração (ex: a captura experimental)

Isso é exatamente o cenário que a captura experimental acima avisa que pode acontecer. Por isso as configurações do app não vivem só dentro da interface: elas ficam salvas num arquivo de texto simples que dá pra editar na mão, mesmo com o app fechado ou travado.

**Onde fica o arquivo:** `settings.json`, dentro da pasta de dados do app.

- Windows: `%APPDATA%\zero-hop\settings.json` (cole esse caminho na barra de endereço do Explorador de Arquivos)

**Como editar:**

1. Feche o ZeroHop completamente (verifique também no Gerenciador de Tarefas se não sobrou nenhum processo `ZeroHop.exe`).
2. Abra o arquivo `settings.json` num editor de texto simples (Bloco de Notas serve).
3. O conteúdo é um JSON pequeno, por exemplo:

   ```json
   { "autoUpdateEnabled": true, "experimentalWgcCaptureEnabled": true }
   ```

4. Troque o valor que estiver causando o problema pra `false` (no caso da captura experimental, `"experimentalWgcCaptureEnabled": false`) e salve o arquivo.
5. Abra o ZeroHop de novo.

Os campos que existem hoje:

| Campo | Valores | O que faz |
| --- | --- | --- |
| `autoUpdateEnabled` | `true` / `false` | Se o app verifica e baixa atualizações sozinho. Mesmo interruptor da tela de Atualizações. |
| `experimentalWgcCaptureEnabled` | `true` / `false` | Se o app tenta usar `Windows.Graphics.Capture` ao iniciar. Mesmo interruptor da tela de Configurações. Esse é o campo que te salva caso ativar essa opção deixe o app instável a ponto de não conseguir desligá-la pela própria interface. |

O arquivo já é criado sozinho com os valores padrão na primeira vez que o app abre, então ele sempre vai existir depois disso. Mas se o arquivo não existir, estiver vazio ou tiver um JSON inválido por qualquer outro motivo, o app simplesmente ignora e usa os valores padrão (`autoUpdateEnabled: true`, `experimentalWgcCaptureEnabled: false`). Não precisa ter medo de "quebrar" o arquivo além do reparável: na pior das hipóteses, é só apagá-lo inteiro que o app recria com os padrões.

### Por que o app não simplesmente "sempre conecta"

Porque este projeto optou deliberadamente por **nunca usar um servidor de relay (TURN)** como rede de segurança escondida. Veja a seção "Segurança e privacidade" acima. A consequência é que, numa rede muito restritiva, a conexão pode de fato falhar, em vez de silenciosamente cair pra um caminho alternativo fora do seu controle.

## Limitações

- Testado só em Windows até agora. A build de Linux (`AppImage`) existe mas ainda não foi revisada de verdade num desktop Linux real.
- Funciona melhor em redes domésticas comuns. Em redes muito restritivas (por exemplo, algumas redes corporativas ou públicas que bloqueiam tráfego UDP), a conexão direta pode falhar. Isso é intencional: este projeto não usa servidor de relay (TURN), porque as opções gratuitas viáveis têm limite de banda baixo demais pra valer a pena depender delas.
- É necessário que todos os participantes tenham o app instalado.
- Compartilhar alguns jogos pode ter cursor sumindo, imagem travando/piscando, ou o jogo em tela cheia não aparecendo na lista de janelas. Veja "Cursor sumindo, imagem travando ou piscando ao compartilhar jogos" na seção de solução de problemas acima. Não temos uma solução completa pra isso ainda.

## Licença

[MIT](LICENSE). Use, modifique, empacote, distribua e faça fork à vontade.
