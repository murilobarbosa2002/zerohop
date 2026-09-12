export const PRE_ROOM_STRINGS = {
  title: 'Entrar',
  nameFieldLabel: 'Seu nome',
  nameFieldPlaceholder: 'Como seus amigos vão te ver (vale pra criar ou entrar numa sala)',
  createRoomButton: 'Criar sala nova',
  orSeparator: 'ou',
  codeFieldLabel: 'Código da sala',
  codeFieldPlaceholder: 'Cole aqui o código que seu amigo te mandou',
  joinRoomButton: 'Entrar na sala',
  codeRequiredError: 'Digite o código da sala.',
  creatingRoomStatus: 'Criando sala...',
  joiningRoomStatus: 'Entrando na sala...',
  createRoomError: (reason: string) => `Não foi possível criar a sala (${reason}). Tente de novo.`,
  joinRoomError: (reason: string) => `Não foi possível conectar (${reason}). Tente de novo.`,
  passwordFieldLabel: 'Senha da sala (opcional)',
  passwordFieldPlaceholder: 'Deixe em branco pra não usar senha'
} as const;
