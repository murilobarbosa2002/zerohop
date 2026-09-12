# Privacidade e criptografia

**Resumo em uma frase:** vídeo, áudio, voz, chat e as mensagens internas da sala são criptografados ponta a ponta e nunca ficam salvos em lugar nenhum, nem em disco, nem em servidor, nem acessíveis a quem fez este programa.

Esta página existe pra você não precisar confiar apenas na nossa palavra: tudo aqui pode ser conferido lendo o código-fonte, que é público.

## O que é criptografado, e como

Vídeo, áudio, voz e as mensagens que os participantes trocam entre si (lista de membros, status de compartilhamento, chat) trafegam usando **WebRTC**, que já criptografa tudo nativamente com **DTLS-SRTP**. Isso não é uma funcionalidade que o ZeroHop precisou construir. É uma garantia do próprio protocolo, presente em qualquer aplicação WebRTC (inclusive chamadas de vídeo de navegador).

Na prática, isso significa que ninguém no meio do caminho, nem a rede, nem um provedor de internet, nem o serviço usado pra apresentar os participantes uns aos outros, consegue ler o conteúdo do que está sendo compartilhado.

## O que é o "broker" e o que ele vê

Para dois computadores conseguirem se conectar diretamente pela internet, alguém precisa apresentá-los um ao outro primeiro, trocando os dados técnicos necessários (endereços, capacidades de rede). O ZeroHop usa o **broker público e gratuito do [PeerJS](https://peerjs.com/)** (`0.peerjs.com`) só para essa etapa inicial de apresentação.

Esse broker é um serviço de terceiro, fora do controle deste projeto. Ele enxerga metadados de conexão (por exemplo, que um participante com tal código de sala está tentando se conectar com outro), mas **nunca** o conteúdo de vídeo, áudio, voz, chat ou qualquer mensagem da sala, porque essas nunca passam por ele. Elas só existem na conexão direta entre os PCs, depois que a apresentação inicial termina.

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
