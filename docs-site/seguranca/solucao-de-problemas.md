# Solução de problemas

**Resumo em uma frase:** na grande maioria dos casos, "não consigo conectar" é a rede ou o antivírus de alguém bloqueando o tráfego direto — não um bug do programa.

## Passo a passo

### 1. Confira o código e a senha

Um espaço a mais ou uma letra trocada já impede a conexão. Se a sala tiver senha, confirme que os dois lados digitaram exatamente a mesma. Por design, não existe um aviso explícito de "senha errada" — isso evitaria que alguém ficasse tentando adivinhar a senha de terceiros.

### 2. Verifique o antivírus

Muitos antivírus de terceiros (ESET, Avast, Norton, Kaspersky, entre outros) **gerenciam o Firewall do Windows por baixo dos panos**. Nesses casos, adicionar uma exceção pela tela nativa do "Firewall do Windows Defender" não resolve nada, porque quem decide bloquear ou não é o antivírus, não o Windows.

A exceção de rede precisa ser criada **dentro do próprio antivírus** — geralmente numa seção chamada "Firewall", "Proteção de rede" ou "Regras de aplicativo".

### 3. Considere o tipo de rede

Redes corporativas, escolares ou de locais públicos (faculdade, empresa, evento) costumam bloquear tráfego UDP direto entre dispositivos de propósito, por política de segurança da própria rede. Nesse caso, tente numa rede doméstica comum.

### 4. Veja os detalhes técnicos

Aperte **F12** dentro do programa para abrir as ferramentas de desenvolvedor e ver o console. O ScreenShare registra logs técnicos (`[ice]`, `[ice-route]`) que mostram exatamente em que ponto a conexão parou de progredir — úteis para reportar um problema numa issue no GitHub.

## Por que o programa não "sempre conecta"

Porque este projeto optou deliberadamente por nunca usar um servidor de relay (TURN) como rede de segurança escondida — veja [Sem servidor, sem TURN](/seguranca/sem-servidor-sem-turn). A consequência é que, numa rede muito restritiva, a conexão pode de fato falhar, de forma visível, em vez de silenciosamente cair para um caminho alternativo fora do seu controle.
