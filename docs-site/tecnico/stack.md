# Stack e build

**Resumo em uma frase:** Electron + React + TypeScript + Tailwind CSS, com o instalador Windows compilado automaticamente via GitHub Actions.

> **Testado só no Windows.** É o único sistema onde o app foi usado de verdade até agora. Existe um alvo de build pra Linux (`AppImage`), mas essa build ainda não foi revisada num desktop Linux real.

## Com o que o programa é feito

- **[Electron](https://www.electronjs.org/)**: o programa roda como um aplicativo de desktop nativo, não como um site.
- **[React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)**: toda a interface e a lógica da aplicação, com tipagem estrita em todo o projeto (processo principal, ponte de comunicação e interface).
- **[Tailwind CSS](https://tailwindcss.com/)**: estilo visual, usando apenas tokens de design configurados, sem valores soltos espalhados pelo código.
- **[Vite](https://vitejs.dev/)** (via [electron-vite](https://electron-vite.org/)): empacotamento do código.
- **[PeerJS](https://peerjs.com/)** sobre **WebRTC**: sinalização e conexão direta de vídeo, áudio e voz.
- **[Zod](https://zod.dev/)**: validação de formulários e de todas as mensagens trocadas entre participantes.
- **[electron-updater](https://www.electron.build/auto-update)**: atualização automática via GitHub Releases, com verificação periódica em segundo plano.

## Como o instalador é gerado

O instalador para Windows (formato NSIS) nunca é compilado localmente pelo autor. Isso é feito automaticamente, do zero, por um workflow do **GitHub Actions** rodando numa máquina Windows real e gratuita, disparado a cada nova tag de versão (`vX.Y.Z`) publicada no repositório. O fluxo completo, do código-fonte até o `.exe` publicado nas Releases, é público e pode ser conferido no arquivo `.github/workflows/release.yml` do repositório.

## Testes

Existe uma suíte de testes end-to-end versionada no repositório (pasta `e2e/`), rodada com `npm run test:e2e`: builda o app e usa o Playwright contra o binário real do Electron, abrindo múltiplas instâncias e simulando pessoas de verdade se conectando entre si. Cobre criar/entrar em sala, compartilhar tela (incluindo editar resolução/fonte com o compartilhamento já em andamento), assistir, falar por voz e a tela de Configurações/Logs. Um workflow de CI (`.github/workflows/ci.yml`) roda essa suíte, junto com checagem de tipos e build, a cada push na `main` e a cada pull request.

## Todo o código é público

Não existe nenhum binário fechado, nenhuma dependência proprietária escondida, nenhuma parte do programa que não esteja neste mesmo repositório. Qualquer pessoa pode clonar, ler linha por linha e compilar a própria versão a partir do zero.
