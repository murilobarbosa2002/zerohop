# Senha e moderação da sala

**Resumo em uma frase:** o código da sala é um convite, não uma senha — por isso existe um campo de senha opcional e a possibilidade de remover alguém que entrou sem querer.

## Por que o código sozinho não é suficiente

O código da sala tem bastante entropia (mais de 1 bilhão de combinações possíveis), então ninguém vai "adivinhar" um código por acaso. O risco real é outro: um código pode vazar por engano — encaminhado pra pessoa errada, colado num grupo público, capturado numa print de tela. Se isso acontecer e não houver mais nenhuma barreira, qualquer pessoa com aquele código poderia tentar entrar.

## Senha opcional

Ao criar a sala, você pode definir uma senha. Quem for entrar precisa digitar exatamente a mesma senha, além do código. Se a senha não bater, a pessoa simplesmente não entra — e nem aparece na lista de participantes de ninguém, como se a tentativa nunca tivesse acontecido.

Isso funciona nos dois sentidos: se você digitar a senha errada ao tentar entrar numa sala, você também não vai ver ninguém daquela sala, porque a validação acontece nos dois lados ao mesmo tempo.

## Remover alguém da sala

Só quem **criou** a sala pode remover outra pessoa dela. Ao remover:

- A conexão com essa pessoa é encerrada imediatamente, dos dois lados.
- Ela é bloqueada de reconectar sozinha, automaticamente, na mesma sessão.
- Os outros participantes também deixam de estar conectados com ela.

## O que isso não é

Isso não é um sistema de contas ou permissões complexo — é deliberadamente simples, porque a sala em si é pensada pra durar só enquanto o grupo de amigos está usando. Veja [Sem servidor, sem TURN](/seguranca/sem-servidor-sem-turn) pra entender por que a arquitetura é assim.
