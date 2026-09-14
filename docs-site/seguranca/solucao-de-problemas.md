# Solução de problemas

**Resumo em uma frase:** na grande maioria dos casos, tanto o aviso de "Windows protegeu o computador" ao instalar quanto "não consigo conectar" depois de instalado são comportamento esperado, não um bug do programa.

## Ao instalar: "O Windows protegeu o computador" / "Fornecedor desconhecido"

Isso é esperado. É o **Microsoft Defender SmartScreen**, um filtro do Windows que avisa sobre qualquer instalador que ainda não acumulou reputação suficiente na base da Microsoft. Isso acontece com **qualquer** programa novo que não paga por um certificado de assinatura de código (um selo digital emitido por empresas como a DigiCert, com custo de assinatura anual).

O ZeroHop é um projeto gratuito e sem fins lucrativos, então não existe esse certificado, e é por isso que aparece "Fornecedor desconhecido". Isso não indica que o instalador foi comprometido, só que a Microsoft não foi paga para "confirmar" o autor.

Se você baixou o instalador direto da [página de Releases do repositório oficial](https://github.com/murilobarbosa2002/zerohop/releases) (não de um link de terceiro), pode seguir com a instalação:

1. Clique em **"Mais informações"** na primeira tela do aviso.
2. Clique no botão **"Executar assim mesmo"** que aparece em seguida.

Como todo o processo de build é público (`.github/workflows/release.yml`, rodando num runner oficial do GitHub Actions), qualquer pessoa pode auditar ou reproduzir o mesmo instalador a partir do mesmo código-fonte, em vez de precisar confiar apenas na palavra do autor.

## Não consigo conectar numa sala

### 1. Confira o código e a senha

Um espaço a mais ou uma letra trocada já impede a conexão. Se a sala tiver senha, confirme que os dois lados digitaram exatamente a mesma. Por design, não existe um aviso explícito de "senha errada", isso evitaria que alguém ficasse tentando adivinhar a senha de terceiros.

### 2. Verifique o antivírus

Muitos antivírus de terceiros (ESET, Avast, Norton, Kaspersky, entre outros) **gerenciam o Firewall do Windows por baixo dos panos**. Nesses casos, adicionar uma exceção pela tela nativa do "Firewall do Windows Defender" não resolve nada, porque quem decide bloquear ou não é o antivírus, não o Windows.

A exceção de rede precisa ser criada **dentro do próprio antivírus**, geralmente numa seção chamada "Firewall", "Proteção de rede" ou "Regras de aplicativo".

### 3. Considere o tipo de rede

Redes corporativas, escolares ou de locais públicos (faculdade, empresa, evento) costumam bloquear tráfego UDP direto entre dispositivos de propósito, por política de segurança da própria rede. Nesse caso, tente numa rede doméstica comum.

### 4. Veja os detalhes técnicos

Abra a tela de **Logs** dentro do próprio app (ícone na barra de título, ou dentro da sala na barra do microfone). Cada evento de conexão aparece numa frase simples, e os que têm informação técnica por trás mostram um "▸ Detalhes técnicos", útil para reportar um problema numa issue no GitHub. O botão **Copiar** no topo da tela copia o histórico inteiro como texto, pronto pra colar numa conversa e mandar pra alguém ajudar a diagnosticar.

### Entrei na sala, mas não consigo ouvir/assistir uma pessoa específica (os outros funcionam normalmente)

Isso é diferente de não conseguir entrar na sala — o problema é só entre você e uma pessoa específica, geralmente quando os dois estão em redes bem distantes (cidades ou operadoras diferentes). Como o ZeroHop nunca usa um servidor de relay (veja [Sem servidor, sem TURN](/seguranca/sem-servidor-sem-turn)), a conexão de voz/vídeo entre duas pessoas específicas depende de as duas redes conseguirem "se enxergar" diretamente — e algumas combinações de roteador/operadora (principalmente CGNAT, comum em internet móvel e em algumas operadoras residenciais) simplesmente não conseguem, mesmo com o resto da sala funcionando normalmente. É esperado que essa falha seja assimétrica (uma pessoa consegue assistir a tela da outra, mas não o contrário) — cada direção da conexão negocia separadamente. Não tem uma correção de código pra isso sem um servidor de relay, que é a troca deliberada feita neste projeto (privacidade de rede em vez de sempre conectar). Testar numa rede diferente (outro Wi-Fi, ou hotspot do celular num dos dois lados) costuma confirmar se é isso mesmo.

## Cursor sumindo, imagem travando ou piscando ao compartilhar jogos

Relatado com Project Zomboid e Deadlock, mas pode acontecer com outros jogos. Três sintomas possíveis:

- O jogo em **tela cheia exclusiva** ("Fullscreen" de verdade, não Borderless) não aparece na lista de "Uma janela específica".
- Compartilhando **a janela do jogo** (com ele em Borderless/Windowed), o cursor do mouse some enquanto o jogo está em foco.
- Compartilhando **a tela inteira**, a imagem trava com o cursor padrão do Windows parado no meio da tela, e só atualiza um frame ao trocar de janela (Alt+Tab), travando de novo quase na hora.

**Somos honestos: não temos uma solução completa pra isso.** É uma limitação de como o Windows expõe jogos pra qualquer programa de captura de tela, não só este app.

**O que costuma ajudar (fora do app):**

1. No atalho/executável do jogo, vá em Propriedades → Compatibilidade e marque **"Desativar otimizações de tela cheia"**.
2. Mantenha o jogo em modo **Borderless/Windowed**, não fullscreen exclusivo.

**O que o app oferece:** o app usa a API `Windows.Graphics.Capture` do Windows, feita pela própria Microsoft pra lidar melhor com esses casos, em vez do método padrão de captura. Essa API já causou travamento completo do PC em pelo menos um computador testado numa versão bem mais antiga do app; depois de re-testada e confirmada estável, ela passou a vir ativada por padrão pra todo mundo, sem opção de configuração — pode resolver, pode não resolver, o comportamento ainda varia por driver de GPU e versão do Windows.

**O que consideramos e decidimos não fazer:** a técnica que o Discord ("Compartilhar jogo") e o OBS ("Game Capture") usam, injetar um hook direto no processo do jogo, resolveria de verdade, mas **sistemas anti-cheat (Vanguard, Easy Anti-Cheat, BattlEye) tratam esse tipo de injeção como comportamento de hack**, o que pode gerar banimento. O Discord não tem esse problema porque está numa lista de exceção negociada com essas empresas, algo fora do alcance de um projeto pessoal e gratuito. O risco de banir a conta de jogo de alguém é grande demais pra valer a pena.

Se você entende do assunto e conhece uma solução real, uma issue ou pull request é muito bem-vinda. É possível que estejamos vendo esse problema de forma incompleta.

## Compartilhando "Tela inteira" e a imagem fica preta pra sempre depois de usar o Recorte (Win+Shift+S)

Usar a ferramenta de Recorte do Windows (ou o Print Screen básico) enquanto compartilha a tela inteira pode deixar a imagem presa em preto, sem voltar sozinha, mesmo esperando. É um gatilho diferente do problema dos jogos acima: o overlay de escurecer a tela que o Recorte usa parece invalidar a sessão de captura do navegador por baixo dos panos.

Não conseguimos detectar isso de forma confiável dentro do app (o vídeo continua tecnicamente "ativo", só entregando frames pretos). A solução é simples: clique em "Parar de compartilhar" e depois em "Compartilhar minha tela" de novo. Isso força uma sessão de captura nova e resolve.

## "Áudio de só um app específico" está saindo o áudio do sistema inteiro

Por padrão, escolher "áudio de só um app específico" ao compartilhar uma janela não isola o áudio de verdade — é uma limitação de longa data do Chromium/Electron, não um bug deste app: a captura de áudio de janela sempre pega o áudio de saída do sistema inteiro, ignorando qual janela foi escolhida.

O app já corrige isso por padrão, capturando o áudio por processo (WASAPI) em vez do áudio do sistema inteiro, quando você compartilha uma janela específica com áudio.

## Com 3 ou mais pessoas, dois amigos não se viam/ouviam entre si (só cada um com quem criou a sala)

**Corrigido na v0.30.2.** A sala usa arquitetura **mesh**: não existe servidor central retransmitindo vídeo/voz, cada par de participantes abre sua própria conexão P2P direta. Numa sala com 3 pessoas isso são 3 conexões diretas, não só duas passando por quem criou a sala.

O sintoma era sempre o mesmo: quem criou a sala enxergava todo mundo, mas dois convidados nunca se enxergavam entre si, de forma 100% reproduzível. Era um bug real no protocolo que apresenta um novo participante aos outros: o código marcava o participante como "já conhecido" antes de decidir se deveria conectar diretamente com ele, então a conexão entre os dois convidados nunca chegava a ser tentada.

### Por que o programa não "sempre conecta"

Porque este projeto optou deliberadamente por nunca usar um servidor de relay (TURN) como rede de segurança escondida. Veja [Sem servidor, sem TURN](/seguranca/sem-servidor-sem-turn). A consequência é que, numa rede muito restritiva, a conexão pode de fato falhar, de forma visível, em vez de silenciosamente cair para um caminho alternativo fora do seu controle.
