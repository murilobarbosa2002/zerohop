# Privacidade e criptografia

**Resumo em uma frase:** vídeo, áudio, voz, chat e as mensagens internas da sala são criptografados ponta a ponta e nunca ficam salvos em lugar nenhum, nem em disco, nem em servidor, nem acessíveis a quem fez este programa.

Esta página existe pra você não precisar confiar apenas na nossa palavra: tudo aqui pode ser conferido lendo o código-fonte, que é público.

## O que é criptografado, e como

Vídeo, áudio, voz e as mensagens que os participantes trocam entre si (lista de membros, status de compartilhamento, chat) trafegam usando **WebRTC**, que já criptografa tudo nativamente com **DTLS-SRTP**. Isso não é uma funcionalidade que o ZeroHop precisou construir. É uma garantia do próprio protocolo, presente em qualquer aplicação WebRTC (inclusive chamadas de vídeo de navegador).

Na prática, isso significa que ninguém no meio do caminho, nem a rede, nem um provedor de internet, nem o serviço usado pra apresentar os participantes uns aos outros, consegue ler o conteúdo do que está sendo compartilhado.

## O que é o "broker" e o que ele vê

Para dois computadores conseguirem se conectar diretamente pela internet, alguém precisa apresentá-los um ao outro primeiro, trocando os dados técnicos necessários (endereços, capacidades de rede). O ZeroHop usa o **broker público e gratuito do [PeerJS](https://peerjs.com/)** (`0.peerjs.com`) só para essa etapa inicial de apresentação.

Esse broker é um serviço de terceiro, fora do controle deste projeto. Especificamente, ele vê:

- **O ID de cada peer.** O ID de quem cria a sala é literalmente o código da sala (as 6 letras/números que você compartilha). Quem entra recebe um ID aleatório gerado pelo próprio PeerJS.
- **Quem está tentando se conectar com quem** — o pedido de conexão de um peer pro outro passa pelo broker, porque é ele quem faz a apresentação inicial.
- **A negociação técnica da conexão (SDP/ICE)**, que é obrigatória em qualquer aplicação WebRTC, não uma escolha deste projeto. Isso inclui os endereços IP e portas candidatos à conexão: o IP público (via STUN) e também o IP da sua rede local, porque o ZeroHop desativa de propósito a ofuscação de IPs locais por mDNS do Chromium (sem isso, a conexão podia falhar em algumas redes do Windows).
- **Uma etiqueta genérica em chamadas de vídeo/voz** (`"share"` ou `"voice"`, só pra diferenciar o tipo de chamada), sem nenhum dado pessoal.

O que o broker **nunca** vê: seu nome e a senha da sala só são trocados depois que a conexão direta com a outra pessoa já está aberta (então já é P2P, criptografado por DTLS) — o broker não participa dessa troca. Da mesma forma, conteúdo de vídeo, áudio, voz, chat e a lista de membros da sala só existem depois da conexão direta estabelecida, nunca passando pelo broker.

Essa mesma conexão direta significa que **os participantes de uma sala veem o endereço IP (público, e também o local da rede) uns dos outros** — é privado no conteúdo, mas não anônimo na rede. Veja [Sem servidor, sem TURN](/seguranca/sem-servidor-sem-turn) para entender por que essa é uma consequência deliberada da decisão de nunca usar um relay.

## Chat: nada é salvo, em lugar nenhum

O chat de texto da sala existe apenas na memória RAM do processo de cada participante enquanto a sala está aberta:

- Nenhuma mensagem é gravada em disco.
- Nenhuma mensagem é enviada pra nenhum servidor.
- Nenhuma mensagem chega até quem fez este programa. Ele nunca teve acesso a elas.
- Ao clicar em **Sair da sala** ou fechar o programa, seu histórico de chat é apagado imediatamente e não pode ser recuperado, porque nunca existiu em nenhum outro lugar além da sua própria memória.

## Não existe um "fechamento de sala" global

Como não há servidor central controlando a sala, não existe um evento único de "a sala inteira fechou para todo mundo ao mesmo tempo". O que existe é individual: quando cada pessoa sai, a sessão dela termina e o que só existia nela (como o chat) desaparece. Quando todo mundo sai, a sala simplesmente deixa de ter qualquer atividade. Não sobra nada, em lugar nenhum.

## Nenhuma telemetria

O ZeroHop não coleta métricas de uso, não envia analytics, não registra quem usa o programa, quando ou como. Não existe nenhum mecanismo de coleta de dados embutido. Todo o código está neste repositório para qualquer pessoa confirmar isso por conta própria.
