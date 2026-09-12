# Senha e moderação da sala

**Resumo em uma frase:** o código da sala é um convite, não uma senha. Por isso toda sala exige uma senha obrigatória, além da possibilidade de remover alguém que entrou sem querer.

## Por que o código sozinho não é suficiente

O código da sala tem bastante entropia (mais de 1 bilhão de combinações possíveis), então ninguém vai "adivinhar" um código por acaso. O risco real é outro: um código pode vazar por engano, encaminhado pra pessoa errada, colado num grupo público, capturado numa print de tela. Se isso acontecer e não houver mais nenhuma barreira, qualquer pessoa com aquele código poderia tentar entrar.

## Senha obrigatória

Ao criar uma sala, é obrigatório definir uma senha (mínimo de 4 caracteres). Não existe mais a opção de criar uma sala sem nenhuma proteção além do código. Quem for entrar precisa digitar exatamente a mesma senha, além do código. Se a senha não bater, a pessoa simplesmente não entra, e nem aparece na lista de participantes de ninguém, como se a tentativa nunca tivesse acontecido.

Isso funciona nos dois sentidos: se você digitar a senha errada ao tentar entrar numa sala, você também não vai ver ninguém daquela sala, porque a validação acontece nos dois lados ao mesmo tempo.

## Aprovação manual de quem entra

Além da senha, existe mais uma camada: sempre que alguém tenta entrar (mesmo digitando o código e a senha certos), **quem criou a sala** recebe um pop-up com o nome dessa pessoa e decide, na hora, se aceita ou recusa. A pessoa só entra de fato depois dessa confirmação manual.

Isso é uma camada adicional de controle, não um substituto da senha: as duas continuam existindo juntas. Enquanto o criador não responde, quem está tentando entrar vê uma mensagem de "aguardando aprovação". Se o criador não responder em um tempo razoável, o pedido é recusado automaticamente, pra não deixar ninguém esperando pra sempre.

Se o criador recusar, a pessoa simplesmente não entra, sem nenhuma explicação enviada de volta, e nem aparece na lista de participantes de ninguém, como se a tentativa nunca tivesse acontecido.

## Remover alguém da sala

Só quem **criou** a sala pode remover outra pessoa dela. Ao remover:

- A conexão com essa pessoa é encerrada imediatamente, dos dois lados.
- Ela é bloqueada de reconectar sozinha, automaticamente, na mesma sessão.
- Os outros participantes também deixam de estar conectados com ela.

## O que isso não é

Isso não é um sistema de contas ou permissões complexo. É deliberadamente simples, porque a sala em si é pensada pra durar só enquanto o grupo de amigos está usando. Veja [Sem servidor, sem TURN](/seguranca/sem-servidor-sem-turn) pra entender por que a arquitetura é assim.
