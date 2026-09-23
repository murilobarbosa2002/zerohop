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
    'invite-failed': 'Falha ao convidar',
    'member-joined': 'Membro entrou',
    'member-left': 'Membro saiu',
    'join-request': 'Pedido de entrada',
    'update-available': 'Atualização disponível',
    'personal-room-password-missing': 'Sala pessoal sem senha',
    'contact-online': 'Contato ficou online'
  },
  categoryLabels: {
    invites: 'Convites',
    room: 'Sala',
    system: 'Sistema'
  },
  inviteReceivedMessage: (name: string) => `${name} te convidou pra uma sala.`,
  inviteAcceptedMessage: (name: string) => `Você entrou na sala de ${name} pelo convite.`,
  inviteDeclinedMessage: (name: string) => `Você recusou o convite de ${name}.`,
  inviteSendFailedMessage: (name: string) => `Não foi possível convidar ${name} — a pessoa parece estar offline agora.`,
  inviteRejectedUnknownSenderMessage: (name: string) =>
    `Não foi possível convidar ${name}: ela desabilitou convites de quem não é contato dela.`,
  memberJoinedMessage: (name: string) => `${name} entrou na sala.`,
  memberLeftMessage: (name: string) => `${name} saiu da sala.`,
  joinRequestMessage: (name: string) => `${name} pediu pra entrar na sua sala.`,
  updateAvailableMessage: (version: string) => `Versão ${version} disponível pra instalar.`,
  personalRoomPasswordMissingMessage:
    'Sua sala pessoal está configurada pra abrir sozinha, mas ainda não tem senha — defina uma pra ela funcionar.',
  contactOnlineMessage: (name: string) => `${name} está online agora.`
} as const;
