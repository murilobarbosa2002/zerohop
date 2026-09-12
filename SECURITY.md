# Política de segurança

Este projeto é gratuito, pessoal e sem fins lucrativos. Ainda assim, levamos a sério qualquer problema de segurança real (não confundir com os limites já documentados e conhecidos, listados em [TROUBLESHOOTING.md](TROUBLESHOOTING.md) e na seção "Segurança e privacidade" do [README](README.md)).

## Como reportar uma vulnerabilidade

**Não abra uma issue pública** para uma vulnerabilidade de segurança ainda não corrigida — isso expõe o problema pra qualquer pessoa antes de existir uma correção.

Em vez disso, use a aba **[Security → Report a vulnerability](https://github.com/murilobarbosa2002/zerohop/security/advisories/new)** deste repositório, que abre um relato privado, visível só pra mim até ser resolvido. Descreva:

- O que você encontrou e por que acredita que é uma vulnerabilidade (não só um comportamento indesejado).
- Passos pra reproduzir, se possível.
- O impacto que você imagina que isso teria (por exemplo: vazamento de dados, execução de código, acesso não autorizado a uma sala).

Você recebe uma resposta o mais rápido possível, dentro do que a natureza pessoal deste projeto permite (sem SLA formal, sem equipe de segurança dedicada). Depois de corrigido, o problema pode ser documentado publicamente (changelog, issue), dando crédito a quem reportou, se a pessoa quiser.

## O que conta como vulnerabilidade aqui

Como o projeto é 100% peer-to-peer e não tem servidor próprio, o que mais importa é:

- Qualquer jeito de ler, interceptar ou modificar vídeo/áudio/chat de uma sala sem fazer parte dela.
- Qualquer jeito de entrar numa sala sem saber a senha correta, ou de burlar a aprovação manual de quem criou a sala.
- Qualquer vulnerabilidade que permita executar código arbitrário na máquina de quem usa o app (por exemplo, através de uma mensagem malformada do protocolo da sala).

O que **não** entra como vulnerabilidade de segurança (já são limitações conhecidas e documentadas): a conexão falhar em redes muito restritas por não haver servidor de relay (TURN), ou os problemas de captura de tela em jogos específicos listados em [TROUBLESHOOTING.md](TROUBLESHOOTING.md).
