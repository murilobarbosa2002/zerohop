# Como usar

**Resumo em uma frase:** instale, crie ou entre numa sala com um código, compartilhe ou assista. Não tem mais nada além disso.

## Instalar

Baixe o instalador mais recente na [página de Releases do GitHub](https://github.com/murilobarbosa2002/zerohop/releases) e execute-o no Windows. O programa se atualiza sozinho depois disso, avisando quando uma nova versão estiver disponível.

## Atualizações, changelog e versões

Clicando no número da versão, no canto superior esquerdo da janela (ao lado do nome do app), abre uma tela com três abas:

- **Atualização:** mostra a versão que você está usando, deixa verificar manualmente se tem uma nova, acompanha o progresso do download e tem um botão pra instalar e reiniciar quando estiver pronto, sem precisar esperar o aviso automático. Também tem um interruptor de **atualização automática** (ligado por padrão): se você quiser ficar de propósito numa versão mais antiga, desligue esse interruptor, assim o app não vai tentar te puxar sozinho de volta pra versão mais nova. Mesmo desligado, verificar manualmente continua funcionando quando você quiser.
- **Changelog:** o histórico de tudo que mudou em cada versão, direto do repositório.
- **Versões:** lista todas as versões já publicadas. Como este app não troca de versão sozinho (por segurança), escolher uma versão diferente da atual explica o porquê e abre a página daquela Release no seu navegador, pra baixar e instalar o instalador daquela versão manualmente.

**Importante:** o app não deixa duas pessoas com versões diferentes entrarem na mesma sala. Se as versões não baterem, a entrada é recusada automaticamente com uma mensagem explicando a diferença. Pra jogar ou assistir junto, todo mundo precisa estar na mesma versão.

## Configurações

O ícone de engrenagem na barra de título (ao lado dos botões de minimizar/maximizar/fechar) abre a tela de Configurações:

- **Áudio:** em qual dispositivo (alto-falante, fone, etc.) você quer ouvir quem está compartilhando.
- **Microfone:** qual usar pra falar na sala, a sensibilidade dele, e a **supressão de ruído** (vem ligada por padrão).
- **Mixer de efeitos sonoros:** um volume separado pra cada grupo de sons — Interface, Sala, Chat, Chamada de voz e Compartilhamento. Cada interação do app tem um som próprio e único, no clima nostálgico do app, e você decide o quanto ouvir de cada grupo.
- **Escala da interface:** vem em 120% por padrão; aumenta ou diminui o tamanho de tudo (texto, botões, ícones) se estiver pequeno ou grande demais pra sua tela ou visão.
- **Teclas de atalho:** mutar/desmutar o microfone, silenciar/ativar o áudio, e push-to-talk (segurar uma tecla pra falar, com atraso configurável pra desligar o mic ao soltar). Mutar mic e mutar áudio funcionam em qualquer lugar, mesmo com outro programa ou jogo em foco. Push-to-talk tenta funcionar assim também, mas isso depende do sistema permitir — se não permitir, ainda funciona normalmente com o ZeroHop em primeiro plano. Enquanto você segura a tecla de push-to-talk, o botão de microfone na sala fica destacado em verde com um "Falando..." do lado, e toca um som ao começar e outro ao parar de transmitir — assim dá pra confirmar que está funcionando sem precisar olhar pra tela toda hora.

Os campos de senha (ao criar/entrar numa sala) mostram a senha em texto normal por padrão, com um ícone de olho pra ocultar se preferir.

A **captura otimizada para jogos** (Windows.Graphics.Capture) e o **áudio isolado por aplicativo** já vêm ativados por padrão, depois de testados e confirmados como estáveis — não são mais opções configuráveis. O áudio isolado funciona tanto compartilhando uma janela específica quanto a tela inteira: em qualquer um dos dois casos, o campo "Áudio" deixa escolher o som de só um programa específico, sem misturar com o resto do sistema. Veja [Solução de problemas](/seguranca/solucao-de-problemas#cursor-sumindo-imagem-travando-ou-piscando-ao-compartilhar-jogos) se notar algum comportamento estranho de captura ou áudio.

Ao abrir o ZeroHop, a primeira tela pergunta o que você quer fazer: **Criar sala nova** ou **Entrar numa sala**. Cada opção leva pra um formulário dedicado só com os campos daquela ação, sem misturar os dois fluxos.

## Criar uma sala

1. Na tela inicial, clique em **Criar sala nova**.
2. Digite seu nome (obrigatório — é só o que aparece pros outros, não precisa ser seu nome real).
3. Escolha uma **foto de perfil** entre as opções disponíveis (veja [Foto de perfil](#foto-de-perfil) abaixo).
4. Defina uma senha para a sala. É **obrigatória**, toda sala nasce protegida (veja [Senha e moderação](/guia/senha-e-moderacao)).
5. Confirme em **Criar sala nova**.
6. Um código curto aparece no topo da tela. Copie e mande esse código **e a senha** pros seus amigos.

## Entrar numa sala

1. Na tela inicial, clique em **Entrar numa sala**.
2. Digite seu nome (obrigatório).
3. Cole o código que recebeu no campo de código.
4. Digite a senha que a pessoa que criou a sala te passou.
5. Confirme em **Entrar numa sala**.

Se o código ou a senha estiverem errados, você simplesmente não vai conseguir entrar. Não existe uma mensagem de "senha errada" explícita, de propósito, pra dificultar tentativas de adivinhar a senha de terceiros.

## Foto de perfil

Ao criar ou entrar numa sala, escolha uma foto de perfil entre 8 opções desenhadas no mesmo estilo retrô do resto do app (flor, estrela, coração, raio, disquete, fantasma, gato, nota musical). Não é upload de arquivo, é só uma galeria fixa pra escolher — mais simples e sem depender de nenhuma imagem sua. A escolha fica salva no seu dispositivo (não muda de sala pra sala) e é isso que os outros participantes veem ao lado do seu nome.

Ao criar ou entrar numa sala com sucesso, toca um efeito sonoro nostálgico (estilo internet discada) só pra você; quem já está na sala ouve um som diferente quando alguém novo entra.

## Contatos: chamar um amigo sem trocar código toda vez

Na tela inicial, clique em **Contatos**. Lá tem duas partes:

- **Sua sala pessoal:** um ID e uma senha que são só seus, sempre os mesmos. Mande os dois pro seu amigo uma vez (por WhatsApp, Discord, o que preferir) e ele salva como contato. Você escolhe a senha; o ID é gerado sozinho.
- **Seus contatos:** a lista de gente que você salvou. Pra adicionar alguém, peça o "Seu ID" e a senha da sala pessoal dela, cole no formulário "Adicionar contato" junto com um apelido, e pronto — da próxima vez é só clicar em **Chamar**, sem digitar nada de novo. Uma bolinha ao lado do nome mostra se a pessoa está online agora (sala pessoal dela aberta) ou offline — assim dá pra saber antes de tentar chamar.

Chamar um contato funciona exatamente como entrar numa sala normal: a pessoa recebe um pedido de entrada e precisa aprovar (igual qualquer sala), então ela precisa estar com o ZeroHop aberto na hora. O que muda é que você nunca mais precisa perguntar "qual é o código da sala hoje?" — o ID dela é sempre o mesmo.

O ID e a senha da sua sala pessoal ficam salvos só no seu computador (no mesmo lugar que as outras configurações do app), nunca em servidor nenhum. **Assim que você define uma senha, sua sala pessoal passa a abrir sozinha toda vez que o ZeroHop inicia** — não precisa mais clicar em "Abrir minha sala pessoal" depois da primeira vez. Se você trocar a senha depois, a sala já aberta atualiza na hora, sem precisar fechar e abrir de novo. Esse comportamento é configurável: tem um checkbox "Abrir automaticamente quando o ZeroHop iniciar" no card da sala pessoal, ligado por padrão — desmarque se preferir abrir manualmente.

Dentro da sua sala pessoal, uma etiqueta com ícone de casinha aparece perto do código/senha confirmando que é ela — além do selo que já aparece na aba lateral quando você tem várias salas abertas ao mesmo tempo.

### Convidar contatos direto, sem aprovar entrada

Ao criar uma sala nova, se você já tiver contatos salvos, aparece uma seção **"Convidar contatos (opcional)"** — marque quem quiser chamar direto pra essa sala. Diferente de "Chamar" (que é a pessoa entrando numa sala já existente), aqui é você trazendo alguém pra uma sala que você acabou de abrir: a pessoa convidada entra automaticamente, sem precisar de código/senha e sem você precisar aprovar a entrada dela.

O mesmo dá pra fazer a qualquer momento **dentro de uma sala já aberta** (pessoal ou normal): o botão de pessoas na barra de mic/áudio abre um painel com seus contatos salvos, cada um com um botão **Convidar** — funciona exatamente igual, sem código/senha.

Só funciona se a pessoa convidada estiver com o ZeroHop aberto no momento em que você convida — é a única forma do app te alcançar sem depender de nenhum servidor. Se ela não estiver alcançável, você recebe um aviso nas Notificações avisando que o convite falhou, com um botão pra tentar de novo. Quem recebe o convite vê um aviso na hora (e também consegue aceitar ou recusar depois, pela tela de Notificações, se preferir revisar antes) — o convite fica válido por 5 minutos; passado esse tempo, precisa ser reenviado.

Por padrão, qualquer pessoa que souber seu ID pessoal pode te convidar, mesmo que você não a tenha salvo como contato. Se preferir só aceitar convite de quem você já salvou, desligue **"Aceitar convites de quem não é meu contato"** em Configurações → Convites — quem tentar te convidar sem ser seu contato recebe um aviso de que você desativou isso.

## Como a sala é organizada

Dentro da sala, a tela é dividida em três áreas, como um app de chamada:

- **Coluna da esquerda:** código/senha da sala, botão de sair, e a lista de quem está na sala.
- **Área central (o "palco"):** onde aparece o vídeo de quem você está assistindo, ou o botão pra compartilhar sua própria tela.
- **Coluna da direita:** o chat de texto.

As colunas da esquerda e da direita podem ser escondidas (botões "Ocultar sala"/"Ocultar chat" no topo) pra dar mais espaço ao vídeo quando quiser, e também podem ser redimensionadas: arraste a linha divisória entre a coluna e o palco central pra deixá-las mais larga ou mais estreita do jeito que preferir. O tamanho escolhido fica salvo pra próxima vez que você abrir o app. Ocultar a coluna de participantes é só uma questão visual — a voz de todo mundo continua tocando normalmente mesmo com ela escondida.

## Conversar por voz

Ao entrar numa sala, seu microfone liga sozinho e todo mundo já pode se ouvir, sem precisar de nenhum app de voz separado. Na coluna da esquerda, logo abaixo do código da sala, tem uma barra com ícones sempre visíveis:

- **Mutar mic:** silencia sua própria voz pros outros, sem sair da call.
- **Silenciar todos:** para de ouvir a voz de todo mundo. Isso não muda o volume dos compartilhamentos de tela que você estiver assistindo, são dois controles de áudio independentes.

Cada pessoa na lista de participantes tem seu próprio controle de volume (e mudo individual) só pra voz dela, e quem estiver com o microfone mutado aparece com um ícone 🔇 do lado do nome. Pra trocar de microfone ou ajustar a sensibilidade, veja [Configurações](#configurações).

Se o microfone não puder ser usado (permissão negada, sem dispositivo disponível, etc.), você continua entrando na sala normalmente, só ninguém vai conseguir te ouvir. Nesse caso, a tela de Configurações mostra um botão **Permitir microfone** pra tentar de novo sem precisar sair da sala.

## Compartilhar sua tela

No palco central, clique em **Compartilhar minha tela**. Isso abre um painel dedicado, em etapas:

1. Escolha entre **tela inteira** ou **uma janela específica**. O app mostra só as opções relevantes pra essa escolha (só telas, ou só janelas), numa lista que se atualiza sozinha a cada poucos segundos — útil se você acabou de abrir o programa que quer compartilhar.
2. Ajuste resolução, FPS e se quer compartilhar áudio junto (inclusive o áudio de só um programa específico, útil pra não misturar sua voz da call com o áudio da tela compartilhada).
3. Confirme. O painel fecha sozinho e vira uma barra compacta mostrando que você está compartilhando, com uma miniatura da sua tela e os botões de **Editar** e **Parar de compartilhar**.

Clicando na miniatura ela abre ampliada, útil pra conferir se a imagem está nítida ou travando antes de perguntar pra sala.

O botão **Editar** abre de novo o mesmo painel de configuração, já preenchido com o que você está compartilhando agora, e deixa trocar resolução, FPS, áudio ou até a fonte (tela ou janela) sem parar o compartilhamento: quem estiver assistindo continua recebendo o vídeo, sem interrupção. A única troca que ainda exige parar e começar de novo é ligar/desligar o áudio no meio da call (trocar de uma fonte de áudio pra outra funciona normalmente).

## Assistir a tela de alguém

Na lista de participantes (coluna da esquerda), quem estiver compartilhando aparece com um indicador verde. Clique em **Assistir** pra receber o vídeo dessa pessoa, que aparece no palco central, não mais dentro da própria lista. O vídeo só é enviado pra quem pede explicitamente, não fica todo mundo recebendo o stream de todo mundo o tempo todo. Se você assistir mais de uma pessoa ao mesmo tempo, os vídeos aparecem lado a lado no palco.

O vídeo sempre aparece no tamanho real do que está sendo compartilhado, sem esticar nem cortar. O botão "Tela cheia" abre uma visualização ampliada (clique fora dela ou aperte Esc pra fechar). O controle de volume abaixo do vídeo ajusta só o áudio daquele compartilhamento (o jogo, o vídeo, o que for), sem mexer no volume da voz da pessoa na call — são dois áudios independentes.

## Conversar pelo chat

A coluna da direita tem um chat de texto simples, visível pra todos os participantes autenticados. Links enviados no chat viram clicáveis automaticamente, abrindo no seu navegador padrão. Você pode apagar suas próprias mensagens a qualquer momento (pede confirmação antes, e some pra todo mundo na sala); quem criou a sala também pode apagar a mensagem de qualquer pessoa, útil pra moderação. As mensagens não ficam salvas em lugar nenhum. Veja [Privacidade e criptografia](/seguranca/privacidade) pra entender exatamente o porquê.

## Participar de várias salas ao mesmo tempo

Sem sair de uma sala, clique no **+** na barra fina à esquerda da janela (o "trocador de salas") pra criar ou entrar em outra sala, do mesmo jeito que criar/entrar na primeira. Cada sala em que você está aparece como um quadrado nessa barra; clicar num deles troca o foco pra aquela sala.

Só a sala em foco tem áudio de voz ativo (seu microfone e o que você ouve dos outros). As demais continuam conectadas em segundo plano — o chat, as notificações de "alguém entrou" e o status de compartilhamento de cada uma continuam funcionando normalmente — só sem tocar a voz de ninguém até você focar nela. Uma bolinha com número aparece no quadrado de uma sala em segundo plano quando chega mensagem nova nela.

Se você mutar o microfone antes de trocar de sala, ele continua mutado quando você voltar.

## Sair da sala

Clique em **Sair da sala** a qualquer momento, ou simplesmente feche o programa. Isso encerra sua conexão com todo mundo daquela sala e apaga imediatamente o seu histórico de chat dela. Sair de uma sala não afeta as outras em que você ainda estiver.

## Notificações

O ícone de sino na barra de título abre a tela de **Notificações** — um histórico separado dos Logs, focado no que importa pra você como usuário (não é auditoria técnica): convite recebido/aceito/recusado, alguém entrando ou saindo de uma sala, pedido de entrada pendente, e aviso de atualização disponível. Uma bolinha vermelha aparece no sino quando tem notificação não lida; clicar numa notificação marca ela como lida. O histórico fica salvo mesmo depois de fechar e abrir o app de novo, e tem botão de "Limpar tudo" se quiser começar do zero — e dá pra excluir uma notificação específica também, com confirmação. Dois filtros multi-select (por tipo e por categoria) ajudam a achar uma notificação antiga numa lista grande — igual em Logs, as opções de cada filtro só aparecem conforme já existir notificação daquele tipo/categoria.

## Logs: veja tudo que o app está fazendo

Um ícone na barra de título abre a tela de **Logs**: um histórico de tudo que aconteceu, em frases simples. Entrar/sair da sala, quem entrou e saiu, começar/parar de compartilhar, ativar o microfone, verificar atualizações, problemas de conexão. Não precisa entender nada técnico pra ler.

Quando um item tem informação técnica por trás (um erro, por exemplo), aparece um "▸ Detalhes técnicos" que expande e mostra o texto bruto, pra quem quiser investigar mais fundo ou mandar pra alguém ajudar a resolver um problema. Dá pra filtrar por categoria e por tipo (informação/aviso/erro) ao mesmo tempo, os dois multi-select — e as opções de cada filtro só aparecem conforme já existir algum log daquele tipo/categoria, pra não poluir a lista. O histórico continua salvo mesmo depois de fechar e abrir o app de novo. O botão **Copiar** copia o histórico inteiro como texto, pronto pra colar (Ctrl+V) numa conversa e mandar pra alguém ler. Tem um botão de "Limpar histórico" se quiser começar do zero.
