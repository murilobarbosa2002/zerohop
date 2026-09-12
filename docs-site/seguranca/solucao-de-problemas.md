# Solução de problemas

**Resumo em uma frase:** na grande maioria dos casos, tanto o aviso de "Windows protegeu o computador" ao instalar quanto "não consigo conectar" depois de instalado são comportamento esperado, não um bug do programa.

## Ao instalar: "O Windows protegeu o computador" / "Fornecedor desconhecido"

Isso é esperado. É o **Microsoft Defender SmartScreen**, um filtro do Windows que avisa sobre qualquer instalador que ainda não acumulou reputação suficiente na base da Microsoft. Isso acontece com **qualquer** programa novo que não paga por um certificado de assinatura de código (um selo digital emitido por empresas como a DigiCert, com custo de assinatura anual).

O ZeroHop é um projeto gratuito e sem fins lucrativos, então não existe esse certificado, e é por isso que aparece "Fornecedor desconhecido". Isso não indica que o instalador foi comprometido, só que a Microsoft não foi paga para "confirmar" o autor.

Se você baixou o instalador direto da [página de Releases do repositório oficial](https://github.com/murilobarbosa2002/electron-screen-share/releases) (não de um link de terceiro), pode seguir com a instalação:

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

Abra a tela de **Logs** dentro do próprio app (ícone na barra de título, ou dentro da sala na barra do microfone). Cada evento de conexão aparece numa frase simples, e os que têm informação técnica por trás mostram um "▸ Detalhes técnicos", útil para reportar um problema numa issue no GitHub.

## Cursor sumindo, imagem travando ou piscando ao compartilhar jogos

Relatado com Project Zomboid e Deadlock, mas pode acontecer com outros jogos. Três sintomas possíveis:

- O jogo em **tela cheia exclusiva** ("Fullscreen" de verdade, não Borderless) não aparece na lista de "Uma janela específica".
- Compartilhando **a janela do jogo** (com ele em Borderless/Windowed), o cursor do mouse some enquanto o jogo está em foco.
- Compartilhando **a tela inteira**, a imagem trava com o cursor padrão do Windows parado no meio da tela, e só atualiza um frame ao trocar de janela (Alt+Tab), travando de novo quase na hora.

**Somos honestos: não temos uma solução completa pra isso.** É uma limitação de como o Windows expõe jogos pra qualquer programa de captura de tela, não só este app.

**O que costuma ajudar (fora do app):**

1. No atalho/executável do jogo, vá em Propriedades → Compatibilidade e marque **"Desativar otimizações de tela cheia"**.
2. Mantenha o jogo em modo **Borderless/Windowed**, não fullscreen exclusivo.

**O que o app oferece, com o risco declarado:** em Configurações existe **"Captura otimizada para jogos (experimental)"**, desligada por padrão. Ela faz o app tentar usar a API `Windows.Graphics.Capture` do Windows, feita pela própria Microsoft pra lidar melhor com esses casos. Vem desligada e exige confirmação explícita porque **essa API já causou travamento completo do PC em pelo menos um computador testado** quando tentamos ativá-la à força, sem interruptor, no passado. Agora é opt-in: pode resolver, pode não resolver, o comportamento varia por driver de GPU e versão do Windows.

**O que consideramos e decidimos não fazer:** a técnica que o Discord ("Compartilhar jogo") e o OBS ("Game Capture") usam, injetar um hook direto no processo do jogo, resolveria de verdade, mas **sistemas anti-cheat (Vanguard, Easy Anti-Cheat, BattlEye) tratam esse tipo de injeção como comportamento de hack**, o que pode gerar banimento. O Discord não tem esse problema porque está numa lista de exceção negociada com essas empresas, algo fora do alcance de um projeto pessoal e gratuito. O risco de banir a conta de jogo de alguém é grande demais pra valer a pena.

Se você entende do assunto e conhece uma solução real, uma issue ou pull request é muito bem-vinda. É possível que estejamos vendo esse problema de forma incompleta.

### Por que o programa não "sempre conecta"

Porque este projeto optou deliberadamente por nunca usar um servidor de relay (TURN) como rede de segurança escondida. Veja [Sem servidor, sem TURN](/seguranca/sem-servidor-sem-turn). A consequência é que, numa rede muito restritiva, a conexão pode de fato falhar, de forma visível, em vez de silenciosamente cair para um caminho alternativo fora do seu controle.
