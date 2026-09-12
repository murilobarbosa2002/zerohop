# Arquitetura

**Resumo em uma frase:** uma rede em malha (mesh) peer-to-peer via WebRTC, onde o PeerJS só serve pra apresentação inicial entre os participantes — nunca pra carregar mídia.

## Visão geral

O ScreenShare não tem um "servidor da aplicação". A única peça externa envolvida é o **broker público e gratuito do PeerJS** (`0.peerjs.com`), usado exclusivamente para a etapa de sinalização — ou seja, apresentar dois peers um ao outro para que consigam abrir uma conexão WebRTC direta.

A partir do momento em que a conexão direta é aberta, o broker deixa de ter qualquer papel: vídeo, áudio e as mensagens da sala trafegam só entre os participantes.

## Código de sala = Peer ID

Ao criar uma sala, o programa gera um código curto e o usa como identificador do peer de quem criou a sala nesse broker. Não existe uma "sala" no sentido de um objeto armazenado em algum lugar — o código é literalmente o endereço de quem criou a sala na rede do PeerJS. É por isso que o broker garante, sozinho, que dois códigos nunca colidem enquanto ambos estiverem ativos: ele simplesmente rejeita um segundo peer tentando usar o mesmo identificador.

## Malha (mesh), não estrela

Depois que o segundo participante entra, a rede vira uma malha: cada novo membro troca informações com quem já está na sala através de um protocolo próprio de "fofoca" (gossip), que propaga a lista de membros pra todo mundo. Isso significa que **não existe um "host" central** carregando o tráfego dos outros — cada participante se conecta diretamente aos demais.

## Camadas do protocolo interno

- **`RoomClient`** — orquestrador principal, expõe as ações de alto nível (criar sala, entrar, sair, compartilhar, assistir, mandar mensagem no chat).
- **`PeerConnectionManager`** — cuida do ciclo de vida das conexões WebRTC (abrir, aceitar, fechar, reconectar).
- **`RoomProtocol`** — interpreta as mensagens trocadas entre participantes (apresentação, lista de membros, status de compartilhamento, pedidos de assistir, remoção, chat).
- **`MemberRegistry`** — mantém o estado de quem está na sala, sob o ponto de vista de cada participante.
- **`MediaSharing`** — controla o envio de vídeo/áudio só para quem pediu para assistir.
- **`ChatService`** — mantém o histórico de chat em memória, nunca persistido.

## Autenticação e senha

Toda mensagem de apresentação (`hello`) leva a senha da sala definida por quem criou. Cada participante valida essa senha antes de aceitar o outro como membro visível — se não bater, a conexão é fechada e a pessoa nunca aparece na lista de ninguém. Isso acontece nos dois sentidos, já que a malha não tem uma autoridade central para decidir sozinha.

## Validação de mensagens

Toda mensagem recebida por qualquer participante passa por uma validação de formato (usando [Zod](https://zod.dev/)) antes de ser processada. Uma mensagem malformada, fora do protocolo esperado, é descartada — nunca executada.

## Sem TURN

Não existe nenhum servidor de relay configurado. Veja [Sem servidor, sem TURN](/seguranca/sem-servidor-sem-turn) para os detalhes dessa decisão.
