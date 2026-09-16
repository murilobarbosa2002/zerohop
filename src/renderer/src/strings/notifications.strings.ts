export const NOTIFICATIONS_STRINGS = {
  screenTitle: 'Notificações',
  backButton: '← Voltar',
  emptyMessage: 'Nenhuma notificação ainda.',
  clearButton: 'Limpar tudo',
  clearConfirmMessage: 'Apagar todas as notificações? Não dá pra desfazer.',
  clearConfirmButton: 'Sim, apagar',
  clearCancelButton: 'Cancelar',
  markAllReadButton: 'Marcar tudo como lido',
  deleteButton: 'Excluir',
  deleteConfirmMessage: 'Apagar esta notificação? Não dá pra desfazer.',
  deleteConfirmButton: 'Sim, apagar',
  deleteCancelButton: 'Cancelar',
  typeFilterLabel: 'Filtrar por tipo',
  categoryFilterLabel: 'Filtrar por categoria',
  kindLabels: {
    'invite-received': 'Convite recebido',
    'invite-accepted': 'Convite aceito',
    'invite-declined': 'Convite recusado',
    'member-joined': 'Membro entrou',
    'member-left': 'Membro saiu',
    'join-request': 'Pedido de entrada',
    'update-available': 'Atualização disponível'
  },
  categoryLabels: {
    invites: 'Convites',
    room: 'Sala',
    system: 'Sistema'
  },
  inviteReceivedMessage: (name: string) => `${name} te convidou pra uma sala.`,
  inviteAcceptedMessage: (name: string) => `Você entrou na sala de ${name} pelo convite.`,
  inviteDeclinedMessage: (name: string) => `Você recusou o convite de ${name}.`,
  memberJoinedMessage: (name: string) => `${name} entrou na sala.`,
  memberLeftMessage: (name: string) => `${name} saiu da sala.`,
  joinRequestMessage: (name: string) => `${name} pediu pra entrar na sua sala.`,
  updateAvailableMessage: (version: string) => `Versão ${version} disponível pra instalar.`
} as const;
