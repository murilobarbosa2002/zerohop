# Como usar

**Resumo em uma frase:** instale, crie ou entre numa sala com um código, compartilhe ou assista — não tem mais nada além disso.

## Instalar

Baixe o instalador mais recente na [página de Releases do GitHub](https://github.com/murilobarbosa2002/electron-screen-share/releases) e execute-o no Windows. O programa se atualiza sozinho depois disso, avisando quando uma nova versão estiver disponível.

## Atualizações, changelog e versões

Clicando no número da versão, no canto superior esquerdo da janela (ao lado do nome do app), abre uma tela com três abas:

- **Atualização:** mostra a versão que você está usando, deixa verificar manualmente se tem uma nova, acompanha o progresso do download e tem um botão pra instalar e reiniciar quando estiver pronto — sem precisar esperar o aviso automático. Também tem um interruptor de **atualização automática** (ligado por padrão): se você quiser ficar de propósito numa versão mais antiga, desligue esse interruptor — assim o app não vai tentar te puxar sozinho de volta pra versão mais nova. Mesmo desligado, verificar manualmente continua funcionando quando você quiser.
- **Changelog:** o histórico de tudo que mudou em cada versão, direto do repositório.
- **Versões:** lista todas as versões já publicadas. Como este app não troca de versão sozinho (por segurança), escolher uma versão diferente da atual explica o porquê e abre a página daquela Release no seu navegador, pra baixar e instalar o instalador daquela versão manualmente.

**Importante:** o app não deixa duas pessoas com versões diferentes entrarem na mesma sala — se as versões não baterem, a entrada é recusada automaticamente com uma mensagem explicando a diferença. Pra jogar/assistir junto, todo mundo precisa estar na mesma versão.

## Configurações

O ícone de engrenagem na barra de título (ao lado dos botões de minimizar/maximizar/fechar) abre a tela de Configurações, com duas opções: escolher em qual dispositivo de áudio (alto-falante, fone, etc.) você quer ouvir quem está compartilhando, e escolher qual microfone usar pra falar na sala e ajustar a sensibilidade dele — útil se sua voz está saindo baixa ou estourando pros outros. Nenhuma das duas exige mexer nas configurações do Windows.

Ao abrir o ScreenShare, a primeira tela pergunta o que você quer fazer: **Criar sala nova** ou **Entrar numa sala** — cada opção leva pra um formulário dedicado só com os campos daquela ação, sem misturar os dois fluxos.

## Criar uma sala

1. Na tela inicial, clique em **Criar sala nova**.
2. Digite seu nome (é só o que aparece pros outros — não precisa ser seu nome real).
3. Defina uma senha para a sala — é **obrigatória**, toda sala nasce protegida (veja [Senha e moderação](/guia/senha-e-moderacao)).
4. Confirme em **Criar sala nova**.
5. Um código curto aparece no topo da tela. Copie e mande esse código **e a senha** pros seus amigos.

## Entrar numa sala

1. Na tela inicial, clique em **Entrar numa sala**.
2. Digite seu nome.
3. Cole o código que recebeu no campo de código.
4. Digite a senha que a pessoa que criou a sala te passou.
5. Confirme em **Entrar numa sala**.

Se o código ou a senha estiverem errados, você simplesmente não vai conseguir entrar — não existe uma mensagem de "senha errada" explícita, de propósito, pra dificultar tentativas de adivinhar a senha de terceiros.

## Como a sala é organizada

Dentro da sala, a tela é dividida em três áreas, como um app de chamada:

- **Coluna da esquerda:** código/senha da sala, botão de sair, e a lista de quem está na sala.
- **Área central (o "palco"):** onde aparece o vídeo de quem você está assistindo, ou o botão pra compartilhar sua própria tela.
- **Coluna da direita:** o chat de texto.

As colunas da esquerda e da direita podem ser escondidas (botões "Ocultar sala"/"Ocultar chat" no topo) pra dar mais espaço ao vídeo quando quiser.

## Conversar por voz

Ao entrar numa sala, seu microfone liga sozinho e todo mundo já pode se ouvir — não precisa de nenhum app de voz separado. Na coluna da esquerda, logo abaixo do código da sala, tem dois botões sempre visíveis:

- **Mutar mic:** silencia sua própria voz pros outros, sem sair da call.
- **Silenciar todos:** para de ouvir a voz de todo mundo. Isso não muda o volume dos compartilhamentos de tela que você estiver assistindo — são dois controles de áudio independentes.

Cada pessoa na lista de participantes tem seu próprio controle de volume (e mudo individual) só pra voz dela, e quem estiver com o microfone mutado aparece com um ícone 🔇 do lado do nome. Pra trocar de microfone ou ajustar a sensibilidade, veja [Configurações](#configurações).

Se o microfone não puder ser usado (permissão negada, sem dispositivo disponível, etc.), você continua entrando na sala normalmente — só ninguém vai conseguir te ouvir. Nesse caso, a tela de Configurações mostra um botão **Permitir microfone** pra tentar de novo sem precisar sair da sala.

## Compartilhar sua tela

No palco central, clique em **Compartilhar minha tela** — isso abre um painel dedicado a essa configuração. Primeiro escolha se quer compartilhar a **tela inteira** ou **uma janela específica**; com base nessa escolha, o app mostra só as opções relevantes (só telas, ou só janelas — sem misturar tudo numa lista só). Depois de escolher o que compartilhar, ajuste resolução, FPS e se quer compartilhar áudio junto (inclusive o áudio de só um programa específico, útil pra não misturar sua voz da call com o áudio da tela compartilhada). Depois de confirmar, o painel fecha sozinho e vira uma barra compacta mostrando que você está compartilhando, com uma miniatura da sua tela, o botão de parar e clicando na miniatura ela abre ampliada — útil pra conferir se a imagem está nítida ou travando antes de perguntar pra sala.

## Assistir a tela de alguém

Na lista de participantes (coluna da esquerda), quem estiver compartilhando aparece com um indicador verde. Clique em **Assistir** pra receber o vídeo dessa pessoa — ele aparece no palco central, não mais dentro da própria lista. O vídeo só é enviado pra quem pede explicitamente — não fica todo mundo recebendo o stream de todo mundo o tempo todo. Se você assistir mais de uma pessoa ao mesmo tempo, os vídeos aparecem lado a lado no palco.

## Conversar pelo chat

A coluna da direita tem um chat de texto simples, visível pra todos os participantes autenticados. As mensagens não ficam salvas em lugar nenhum — veja [Privacidade e criptografia](/seguranca/privacidade) pra entender exatamente o porquê.

## Sair da sala

Clique em **Sair da sala** a qualquer momento, ou simplesmente feche o programa. Isso encerra sua conexão com todo mundo e apaga imediatamente o seu histórico de chat daquela sessão.

## Logs — veja tudo que o app está fazendo

Um ícone na barra de título (ou dentro da sala, na mesma barra do microfone) abre a tela de **Logs**: um histórico de tudo que aconteceu, em frases simples — entrar/sair da sala, quem entrou e saiu, começar/parar de compartilhar, ativar o microfone, verificar atualizações, problemas de conexão. Não precisa entender nada técnico pra ler.

Quando um item tem informação técnica por trás (um erro, por exemplo), aparece um "▸ Detalhes técnicos" que expande e mostra o texto bruto, pra quem quiser investigar mais fundo ou mandar pra alguém ajudar a resolver um problema. Dá pra filtrar por categoria e o histórico continua salvo mesmo depois de fechar e abrir o app de novo — tem um botão de "Limpar histórico" se quiser começar do zero.
