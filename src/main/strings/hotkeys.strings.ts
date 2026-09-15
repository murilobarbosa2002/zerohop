export const HOTKEYS_STRINGS = {
  captureStartingMessage: 'Iniciando captura global de teclado (push-to-talk, build de diagnostico)...',
  captureUnavailableMessage: 'Não foi possível ativar a captura global de teclado neste sistema — push-to-talk fica indisponível.',
  captureLoadTimedOutMessage:
    'Carregar a biblioteca de captura de teclado demorou demais e foi cancelado — push-to-talk fica indisponível.',
  captureStartTimedOutMessage: 'Iniciar a captura de teclado demorou demais e foi cancelado — push-to-talk fica indisponível.',
  captureActiveMessage: 'Captura global de teclado ativa — push-to-talk disponível.',
  acceleratorConflictMessage: (label: string) =>
    `Não foi possível registrar a tecla de atalho "${label}" — provavelmente já está em uso por outro programa.`
} as const;
