# Solução de problemas

## "O Windows protegeu o computador" / "Fornecedor desconhecido" ao instalar

Isso é esperado e não significa que o programa tem vírus ou é malicioso. É o **Microsoft Defender SmartScreen**, um filtro do Windows que avisa sobre qualquer instalador que ainda não acumulou reputação suficiente na base da Microsoft. Isso acontece com **qualquer** programa novo, independentemente de quem fez, quando ele não paga por um certificado de assinatura de código (um selo digital emitido por empresas como a DigiCert, que custa uma assinatura anual).

Este projeto é gratuito e sem fins lucrativos, então não existe esse certificado pago, e é exatamente por isso que aparece "Fornecedor desconhecido": o Windows não tem como confirmar automaticamente quem publicou o instalador. Isso não significa que o instalador foi comprometido, só que a Microsoft não foi paga pra "confirmar" o autor.

Se você confia na fonte (baixou direto da [página de Releases do repositório oficial no GitHub](https://github.com/murilobarbosa2002/zerohop/releases), não de um link de terceiro), pode seguir com a instalação:

1. Clique em **"Mais informações"** na primeira tela do aviso.
2. Vai aparecer um botão **"Executar assim mesmo"**. Clique nele.

Se quiser confirmar por conta própria que o instalador é exatamente o que foi compilado a partir deste código-fonte público, sem confiar apenas na nossa palavra, o processo de build inteiro é público e auditável em `.github/workflows/release.yml`. Qualquer pessoa pode reproduzir o mesmo build a partir do mesmo commit.

## "Meu amigo não consegue entrar na minha sala"

Na grande maioria dos casos isso não é um bug do app. É a rede ou o antivírus de alguém bloqueando a conexão direta (WebRTC usa tráfego UDP, que redes mais restritas às vezes barram). Um passo a passo simples pra descobrir o motivo:

1. **Confirme que os dois digitaram exatamente o mesmo código e a mesma senha.** Um espaço a mais ou letra trocada já impede a conexão, e por design ninguém recebe um aviso "senha errada" explícito (isso evitaria que um estranho ficasse tentando adivinhar).
2. **Verifique se algum antivírus de terceiro está instalado** (ESET, Avast, Norton, Kaspersky, etc). Muitos desses programas **gerenciam o Firewall do Windows por baixo dos panos**, ou seja, adicionar uma exceção pela tela nativa do "Firewall do Windows Defender" não resolve nada, porque quem está decidindo bloquear ou não é o antivírus, não o Windows. Nesse caso, a exceção/regra de permissão de rede precisa ser criada **dentro do próprio antivírus** (geralmente numa seção chamada "Firewall", "Proteção de rede" ou "Regras de aplicativo").
3. **Se estiver numa rede corporativa, escolar ou de local público** (faculdade, empresa, evento), é comum que tráfego UDP peer-to-peer seja bloqueado de propósito pela própria rede. Nesse caso, tente numa rede doméstica comum.
4. **Abra a tela de Logs dentro do próprio app** (ícone na barra de título, ou dentro da sala na barra do microfone). Cada evento de conexão aparece numa frase simples, com "▸ Detalhes técnicos" pra quem quiser investigar mais fundo, útil pra quem for reportar um problema numa issue.

## Cursor sumindo, imagem travando ou piscando ao compartilhar jogos

Isso acontece com alguns jogos (relatado com Project Zomboid e Deadlock) e tem três sintomas possíveis:

- O jogo em **tela cheia exclusiva** ("Fullscreen" de verdade, não Borderless) não aparece na lista de "Uma janela específica".
- Com o jogo em janela/Borderless, compartilhando **a janela do jogo**, o cursor do mouse some enquanto o jogo está em foco.
- Compartilhando **a tela inteira** com o jogo aberto (janela ou fullscreen), a imagem trava, aparece o cursor padrão do Windows parado no meio da tela em vez do cursor real, e só atualiza um frame quando você troca de janela (Alt+Tab), voltando a travar quase na hora.

**Somos honestos: não temos uma solução completa pra isso.** É uma limitação de como o Windows expõe a tela e as janelas de jogos pra qualquer programa de captura, não só este. É o mesmo tipo de problema que o Discord e o OBS também enfrentam, resolvendo de formas que explicamos abaixo, com trade-offs que decidimos não trazer pra cá.

**O que costuma ajudar, testado do lado do usuário (fora do app):**

1. No atalho/executável do jogo, vá em **Propriedades** → aba **Compatibilidade** e marque **"Desativar otimizações de tela cheia"**.
2. Mantenha o jogo em modo **Borderless/Windowed** (não fullscreen exclusivo).

**O que o app já faz por padrão:** o app usa a API `Windows.Graphics.Capture` do próprio Windows em vez do método padrão, desenhada pela Microsoft pra lidar melhor com cursor e jogos em tela cheia. **Essa API já causou travamento completo do PC em pelo menos um computador testado** numa versão bem mais antiga do app, quando tentamos ativá-la à força, sem interruptor. Por isso ficou opt-in por várias versões; depois de re-testada e confirmada estável, voltou a vir ativada por padrão pra todo mundo, sem opção de configuração. Pode resolver seu caso, pode não resolver, pode não fazer diferença nenhuma — o comportamento ainda varia por driver de GPU e versão do Windows. Se o app parar de abrir depois de uma atualização, veja "O app não abre mais depois de ativar uma configuração" logo abaixo.

**O que consideramos e decidimos não fazer**, pra deixar claro que pensamos nas alternativas:

- **Captura por injeção direto no processo do jogo** (a técnica que o "Game Capture" do OBS e o compartilhamento de jogo do Discord usam) resolveria o problema de verdade, mas exige injetar uma DLL no processo do jogo, e **muitos sistemas anti-cheat (Vanguard, Easy Anti-Cheat, BattlEye) tratam injeção de código como comportamento de hack**, o que pode gerar alertas ou até banimento em jogos com esses sistemas. O Discord e outras ferramentas grandes (Steam Overlay, GeForce Experience) não têm esse problema porque estão em listas de exceção negociadas diretamente com essas empresas de anti-cheat, algo que um projeto pessoal e gratuito como este não tem como conseguir. Julgamos que o risco pro usuário (banimento numa conta de jogo) é grande demais pra valer a pena.

Se você entende de captura de tela no Windows e sabe de uma solução real pra isso, seja uma configuração que não pensamos, uma forma mais segura de usar WGC, ou qualquer outra ideia, **ficaríamos muito felizes em receber uma contribuição** (issue ou pull request). É bem possível que estejamos enxergando esse problema errado ou incompleto. Este texto reflete o que sabemos até agora, não a última palavra.

## Compartilhando "Tela inteira" e a imagem fica preta pra sempre depois de usar o Recorte (Win+Shift+S)

Usar a ferramenta de Recorte do Windows (ou o Print Screen básico) enquanto compartilha a tela inteira pode deixar a imagem presa em preto, sem voltar sozinha, mesmo esperando. Não é o mesmo problema dos jogos acima: o gatilho aqui é o overlay de escurecer a tela que o Recorte usa, que parece invalidar a sessão de captura do navegador por baixo dos panos.

Não conseguimos detectar isso de forma confiável dentro do app (o vídeo continua tecnicamente "ativo", só entregando frames pretos), então não existe um aviso automático pra esse caso específico ainda. **A solução é simples: clique em "Parar de compartilhar" e depois em "Compartilhar minha tela" de novo.** Isso força uma sessão de captura nova e resolve.

## "Áudio de só um app específico" está saindo o áudio do sistema inteiro (inclusive a voz da call)

Por padrão, o seletor "áudio de só um app específico" na hora de compartilhar uma janela não funciona como o nome sugere. Isso não é um bug introduzido por engano: é uma limitação de longa data do Chromium/Electron (a base deste app) — a captura de áudio de uma janela específica sempre pega o **áudio de saída do sistema inteiro**, ignorando qual janela foi escolhida, porque o Chromium nunca implementou isolamento de áudio por janela nessa API. É por isso que a voz de quem está na call (incluindo a sua própria, saindo pelo ZeroHop) pode vazar pro áudio compartilhado mesmo escolhendo um app específico.

**A partir da v0.28.0 existe uma correção de verdade pra isso**, usando uma biblioteca nativa pequena (`loopback-capture`, baseada na API oficial do Windows `WASAPI Process Loopback`) pra capturar o áudio só do processo escolhido de verdade. Começou como opção experimental (desligada por padrão); depois de testada e confirmada estável, passou a vir **ativada por padrão pra todo mundo**, sem opção de configuração na interface. Se algum dia der problema, dá pra desligar editando o `settings.json` manualmente — veja a seção logo abaixo.

## O app não abre mais depois de uma atualização, ou algum recurso está causando instabilidade

As configurações mais sensíveis do app (as que mexem com captura de tela/áudio em nível baixo) não vivem só dentro da interface: elas ficam salvas num arquivo de texto simples que dá pra editar na mão, mesmo com o app fechado ou travado.

**Onde fica o arquivo:** `settings.json`, dentro da pasta de dados do app.

- Windows: `%APPDATA%\zerohop\settings.json` (cole esse caminho na barra de endereço do Explorador de Arquivos)

**Como editar:**

1. Feche o ZeroHop completamente (verifique também no Gerenciador de Tarefas se não sobrou nenhum processo `ZeroHop.exe`).
2. Abra o arquivo `settings.json` num editor de texto simples (Bloco de Notas serve).
3. O conteúdo é um JSON pequeno, por exemplo:

   ```json
   { "autoUpdateEnabled": true, "experimentalWgcCaptureEnabled": true, "experimentalPerAppAudioEnabled": true }
   ```

4. Troque o valor que estiver causando o problema pra `false` e salve o arquivo.
5. Abra o ZeroHop de novo.

Os campos que existem hoje:

| Campo | Valores | O que faz |
| --- | --- | --- |
| `autoUpdateEnabled` | `true` / `false` | Se o app verifica e baixa atualizações sozinho. Mesmo interruptor da tela de Atualizações. |
| `experimentalWgcCaptureEnabled` | `true` / `false` | Se o app usa `Windows.Graphics.Capture` ao iniciar (captura otimizada pra jogos). Vem `true` por padrão e não tem mais interruptor na interface — esse campo é a única forma de desligar caso cause instabilidade no seu PC. |
| `experimentalPerAppAudioEnabled` | `true` / `false` | Se o app usa captura de áudio por processo (WASAPI) ao compartilhar uma janela com "áudio de só um app específico". Vem `true` por padrão e também não tem mais interruptor na interface. |

O arquivo já é criado sozinho com os valores padrão na primeira vez que o app abre, então ele sempre vai existir depois disso. Mas se o arquivo não existir, estiver vazio ou tiver um JSON inválido por qualquer outro motivo, o app simplesmente ignora e usa os valores padrão. Não precisa ter medo de "quebrar" o arquivo além do reparável: na pior das hipóteses, é só apagá-lo inteiro que o app recria com os padrões.

## Com 3 ou mais pessoas na sala, dois amigos não se viam/ouviam entre si (só cada um com quem criou a sala)

**Corrigido na v0.30.2.** A arquitetura da sala é **mesh** (malha): não existe um "servidor" central retransmitindo vídeo/voz — cada par de participantes abre sua própria conexão P2P direta entre si. Numa sala com 3 pessoas (A, B e C), isso significa **3 conexões diretas** (A↔B, A↔C, B↔C), não só duas passando por quem criou a sala.

O sintoma era exatamente esse: A (quem criou a sala) via e ouvia B e C normalmente, mas B e C nunca conseguiam se ver/ouvir um ao outro, como se cada um estivesse numa sala separada só com A — de forma 100% reproduzível, não uma falha ocasional de rede. A causa era um bug real no protocolo de apresentação entre participantes (`MembershipGossip.handleMembersMessage`): o código marcava um novo participante como "já conhecido" antes de decidir se deveria abrir uma conexão direta com ele, então essa checagem sempre concluía "já é conhecido, não precisa conectar" e a conexão entre os dois convidados nunca era sequer tentada. Bastava reordenar essas duas linhas.

Se depois da v0.30.2 esse sintoma voltar a acontecer, aí sim pode ser a limitação de NAT/rede descrita na seção "Por que o app não simplesmente sempre conecta" logo abaixo (bem menos comum que o bug acima, mas ainda possível).

## Por que o app não simplesmente "sempre conecta"

Porque este projeto optou deliberadamente por **nunca usar um servidor de relay (TURN)** como rede de segurança escondida. Veja a seção "Segurança e privacidade" do [README](README.md). A consequência é que, numa rede muito restritiva, a conexão pode de fato falhar, em vez de silenciosamente cair pra um caminho alternativo fora do seu controle.
