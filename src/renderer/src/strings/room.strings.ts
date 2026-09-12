export const ROOM_STRINGS = {
  roomCodeLabel: 'Código da sala:',
  roomPasswordLabel: 'Senha:',
  leaveRoomButton: 'Sair da sala',
  chooseSourceTitle: 'Escolha o que compartilhar',
  refreshSourcesButton: 'Atualizar lista',
  resolutionFieldLabel: 'Resolução',
  fpsFieldLabel: 'FPS',
  audioFieldLabel: 'Áudio',
  audioSameAsVideoOption: 'Junto com a tela/janela escolhida acima',
  audioNoneOption: 'Nenhum (compartilhar sem áudio)',
  audioOnlyFromOption: (sourceName: string) => `Só o áudio de: ${sourceName}`,
  startSharingButton: 'Compartilhar minha tela',
  stopSharingButton: 'Parar de compartilhar',
  qualityHint: 'FPS e resolução mais altos exigem mais da sua internet e da de quem for assistir — se engasgar, tente valores menores.',
  audioIndependenceHint:
    'O seletor de áudio é independente do de vídeo: dá pra compartilhar a tela toda e escolher o áudio de só um app específico na lista "Áudio".',
  chooseSourceFirstError: 'Escolha primeiro o que compartilhar.',
  captureError: (reason: string) => `Erro ao capturar a tela: ${reason}`,
  sharingWithAudioStatus: 'Compartilhando sua tela com a sala.',
  sharingAudioFallbackStatus: 'Compartilhando sua tela (sem áudio — não foi possível capturar o áudio escolhido nesta máquina).',
  windowSourceKind: 'Janela',
  screenSourceKind: 'Tela toda',
  participantsTitle: 'Participantes',
  connectionWarning:
    'Não foi possível conectar com alguém da sala depois de um tempo — pode ser um bloqueio de rede/firewall/VPN. Aperte F12 pra ver detalhes no console.'
} as const;
