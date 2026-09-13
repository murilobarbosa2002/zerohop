export const COMMON_STRINGS = {
  copyButton: 'Copiar',
  copiedButton: 'Copiado!',
  fullscreenButton: 'Tela cheia',
  updateAvailableTitle: 'Atualização disponível',
  showPasswordButton: 'Mostrar senha',
  hidePasswordButton: 'Ocultar senha',
  paginationPreviousButton: '← Anterior',
  paginationNextButton: 'Próxima →',
  paginationPageLabel: (page: number, totalPages: number) => `Página ${page} de ${totalPages}`
} as const;
