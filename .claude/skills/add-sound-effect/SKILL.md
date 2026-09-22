---
name: add-sound-effect
description: Gera e cadastra um efeito sonoro novo e único pra uma interação nova do ZeroHop (botão, campo, transição de tela). Use sempre que uma UI nova ou interação nova for adicionada e precisar de som, seguindo a regra de bloqueio de "nenhum som reaproveitado" do projeto.
when_to_use: Toda vez que uma ação clicável/interativa nova é adicionada à UI e ainda não tem som próprio.
---

# Adicionar um efeito sonoro novo

Regra completa em `.claude/rules/sound-effects.md`. Esta skill formaliza o processo passo a passo.

1. **Conferir se a ação já tem som.** Abra `src/renderer/src/services/soundEffects.ts` e procure por uma função `play*Sound()` que já cubra essa ação exata. Só reaproveite um som existente se for **literalmente a mesma ação semântica** repetida em outra tela (ex: "Voltar"). Qualquer outra coisa precisa de som novo.
2. **Escolher a categoria** (`SoundCategory` em `src/renderer/src/constants/soundEffects.ts`): Interface, Sala, Chat, Chamada de voz, ou Compartilhamento — pra o volume respeitar o mixer do usuário.
3. **Gerar o `.wav` via script Python** usando `wave`/`struct`/`math` — tons senoidais/triangulares/quadrados/dente-de-serra com envelope de ataque/liberação, opcionalmente uma sequência de 2-3 notas. **Varie forma de onda, frequência, duração e envelope** em relação a todos os sons já existentes em `src/renderer/src/assets/sounds/`, pra garantir que nenhum soe parecido. Não baixar de banco de som externo — o projeto não depende de rede além do broker PeerJS.
4. **Salvar o arquivo** em `src/renderer/src/assets/sounds/nome-da-acao.wav`.
5. **Importar e expor a função** em `soundEffects.ts`: import do `.wav` no topo, função exportada `playNomeDaAcaoSound()` que chama a função de reprodução compartilhada com a categoria escolhida (aplica automaticamente o volume configurado pelo usuário).
6. **Chamar a função no componente** no evento correto (`onClick`, `onChange`, etc.) — nunca `new Audio(...)` direto no componente.
7. Testar rodando o app e confirmar que o som toca e soa distinto dos outros.
