export const HOTKEYS_STRINGS = {
  captureUnavailableMessage: 'Não foi possível ativar a captura global de teclado neste sistema — push-to-talk fica indisponível.',
  captureActiveMessage: 'Captura global de teclado ativa — push-to-talk disponível.',
  acceleratorConflictMessage: (label: string) =>
    `Não foi possível registrar a tecla de atalho "${label}" — provavelmente já está em uso por outro programa.`
} as const;
