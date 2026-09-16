export const NOTIFICATIONS_STRINGS = {
  screenTitle: 'Notificações',
  backButton: '← Voltar',
  emptyMessage: 'Nenhuma notificação ainda.',
  clearButton: 'Limpar tudo',
  clearConfirmMessage: 'Apagar todas as notificações? Não dá pra desfazer.',
  clearConfirmButton: 'Sim, apagar',
  clearCancelButton: 'Cancelar',
  markAllReadButton: 'Marcar tudo como lido',
  inviteReceivedMessage: (name: string) => `${name} te convidou pra uma sala.`,
  inviteAcceptedMessage: (name: string) => `Você entrou na sala de ${name} pelo convite.`,
  inviteDeclinedMessage: (name: string) => `Você recusou o convite de ${name}.`,
  memberJoinedMessage: (name: string) => `${name} entrou na sala.`,
  memberLeftMessage: (name: string) => `${name} saiu da sala.`,
  joinRequestMessage: (name: string) => `${name} pediu pra entrar na sua sala.`,
  updateAvailableMessage: (version: string) => `Versão ${version} disponível pra instalar.`
} as const;
