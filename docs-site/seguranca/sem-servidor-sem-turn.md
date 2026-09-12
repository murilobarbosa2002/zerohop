# Sem servidor, sem TURN

**Resumo em uma frase:** o ScreenShare nunca usa um servidor de relay (TURN) — a conexão é sempre direta entre os dois PCs, ou simplesmente não acontece.

## O que é um servidor TURN, e por que ele existe normalmente

Em algumas redes muito restritivas, duas máquinas não conseguem se conectar diretamente pela internet. A solução técnica comum pra isso é um **servidor TURN**: um intermediário que recebe o tráfego de um lado e repassa pro outro, como um atalho de emergência.

O problema é que um servidor TURN vê (ou pelo menos processa) todo o tráfego que passa por ele, e mantê-lo rodando de graça, com banda suficiente pra vídeo, não é viável — as opções gratuitas testadas têm limites de banda baixos demais pra valer a pena depender delas no dia a dia.

## Por que essa decisão foi tomada de propósito

O ScreenShare optou por **nunca ter um servidor TURN**, nem gratuito nem pago. Isso foi uma decisão deliberada, documentada permanentemente no projeto:

- Sem TURN, não existe um "atalho" escondido por onde o tráfego de alguém possa passar sem essa pessoa saber.
- A conexão é sempre direta entre os PCs — ou, se a rede de alguém bloquear isso, a conexão simplesmente falha, de forma visível, em vez de cair silenciosamente num caminho alternativo fora do controle de qualquer um.

## O que fazer se a conexão falhar

Na grande maioria dos casos, isso é a rede ou o antivírus de alguém bloqueando o tráfego direto (WebRTC usa UDP, que redes mais restritas às vezes bloqueiam). Veja [Solução de problemas](/seguranca/solucao-de-problemas) para o passo a passo completo.

## Reconexão automática

Se a conexão direta cair ou demorar demais pra abrir, o ScreenShare tenta reconectar automaticamente algumas vezes sozinho — sempre tentando de novo uma conexão direta, nunca recorrendo a um relay.
