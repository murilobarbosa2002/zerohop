export const HOME_STRINGS = {
  personalIdTitle: 'Seu ID',
  personalIdHint: 'Mande pra um amigo pra ele te chamar direto.',
  onlineContactsTitle: 'Quem está online',
  onlineContactsCount: (online: number, total: number) => `${online} de ${total} online agora`,
  onlineContactsNone: 'Nenhum contato salvo ainda.',
  onlineContactsChecking: 'Verificando quem está online...',
  recentContactsTitle: 'Chamar de novo',
  recentContactsEmpty: 'Ninguém chamado ainda.',
  recentContactsCallButton: 'Chamar',
  recentContactsCallingStatus: 'Chamando...',
  recentContactsCallError: (reason: string) => `Não foi possível conectar (${reason}).`,
  changelogTitle: 'Novidades',
  changelogLoading: 'Carregando...',
  changelogSeeMoreButton: 'Ver tudo que mudou',
  clockTipTitle: 'Você sabia?',
  tips: [
    'O código da sala é só o endereço de quem criou — sem senha, ninguém entra mesmo sabendo o código.',
    'Dá pra ter várias salas abertas ao mesmo tempo e trocar entre elas sem perder a voz de nenhuma.',
    'Sua sala pessoal tem sempre o mesmo código — configure uma senha e chame amigos sem trocar código toda vez.',
    'O ZeroHop não usa servidor próprio: vídeo, áudio e chat vão direto entre os PCs de quem está na sala.',
    'Push-to-talk reaproveita o mesmo botão de mutar — segurar a tecla ativa o mic na hora.',
    'Cada som do app é único de propósito — nada de efeito genérico reaproveitado.'
  ]
} as const;
