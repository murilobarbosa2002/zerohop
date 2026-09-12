export const SETTINGS_STRINGS = {
  screenTitle: 'Configurações',
  backButton: '← Voltar',
  audioOutputTab: 'Áudio',
  audioOutputTitle: 'Dispositivo de saída de áudio',
  audioOutputHint: 'Escolha em qual alto-falante ou fone você quer ouvir o áudio de quem está compartilhando.',
  audioOutputFieldLabel: 'Ouvir em',
  systemDefaultAudioOutputOption: 'Padrão do sistema',
  unnamedAudioOutputLabel: (index: number) => `Dispositivo de áudio ${index}`
} as const;
