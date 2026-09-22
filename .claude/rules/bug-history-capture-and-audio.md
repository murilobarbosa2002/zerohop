---
paths:
  - "src/main/audioLoopback.ts"
  - "src/renderer/src/services/ScreenCapture.ts"
  - "src/renderer/src/components/Room/**"
---

# Histórico de bugs — captura de tela / áudio (não repetir)

- **`activeCapture.stop()`/`.start()` (`loopback-capture`) podem lançar exceção síncrona e derrubar o app inteiro.** O driver WASAPI recusa "parar de novo" uma captura que já tinha parado sozinha, e `startAudioLoopback` sempre chama `stopAudioLoopback()` primeiro. Envolver `.start()`/`.stop()` em `try/catch` — qualquer chamada síncrona a essa dependência nativa deve ser protegida, não só o carregamento.
- **A flag `AllowWgcScreenCapturer`/`AllowWgcWindowCapturer` (Windows.Graphics.Capture) já travou um PC inteiro em Windows 10 numa tentativa antiga de forçá-la sem interruptor.** Re-testada e confirmada estável na v0.30.x+, ativada por padrão (`DEFAULT_EXPERIMENTAL_WGC_CAPTURE_ENABLED = true`). Se voltar a causar travamento relatado por qualquer usuário, reverter o default pra `false` e trazer o toggle de volta.
- **Compartilhar uma janela específica pode ficar preta ao trocar de janela (Alt+Tab)** — limitação do compositor do Windows, alguns programas param de renderizar o próprio buffer quando ocluídos. Não tentar consertar trocando a API de captura. Mitigação é de produto: avisar o usuário a preferir "Tela inteira" se for alternar entre janelas.
- **Jogos em fullscreen exclusivo (não borderless) não aparecem na lista de "Uma janela específica"** — limitação do Windows, `desktopCapturer` não os enxerga. Orientação: trocar o jogo pra Borderless/Windowed Fullscreen, ou usar "Tela inteira".
- **"Otimizações de tela cheia" do Windows pode causar cursor sumindo/captura travada em alguns jogos** (ex: Java/LWJGL). Mitigação: Propriedades do executável → Compatibilidade → "Desativar otimizações de tela cheia", combinado com Borderless/Windowed.
- **Compartilhar "Tela inteira" pode ficar preto pra sempre depois de usar a ferramenta de Recorte do Windows (Win+Shift+S).** A `MediaStreamTrack` continua `readyState: 'live'` mas entrega frames pretos indefinidamente — não dá pra detectar isso de forma confiável em JS. Mitigação é de produto: parar e começar a compartilhar de novo.
- **Captura de áudio de uma janela específica sempre pega o áudio do sistema inteiro, nunca só daquele app** — limitação de longa data do Chromium/Electron. Corrigido via `loopback-capture` (WASAPI Process Loopback) + `node-window-manager`, ativado por padrão. **Bug corrigido na v0.36.12:** o caminho de áudio isolado só ativava quando o VÍDEO compartilhado era uma janela — precisa checar o tipo do **áudio selecionado**, não o do vídeo.
- **NUNCA forçar `aspect-video` (ou qualquer proporção fixa) no `<video>` que exibe stream de alguém.** Fixar a proporção faz o navegador desenhar uma caixa forçada com `object-fit`, sobrando barra preta quando o conteúdo capturado não é exatamente 16:9. `<video>` sem proporção forçada, só `width/height: auto` com `max-width`/`max-height` como teto.
