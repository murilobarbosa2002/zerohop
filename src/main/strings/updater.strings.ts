export const UPDATER_STRINGS = {
  notificationTitle: 'ZeroHop — atualização pronta',
  notificationBody: (version: string) => `A versão ${version} foi baixada. Clique pra reiniciar e atualizar.`,
  logCheckingMessage: 'Verificando se tem uma atualização nova.',
  logAvailableMessage: (version: string) => `Encontrou a versão ${version} — baixando automaticamente.`,
  logDownloadedMessage: (version: string) => `A versão ${version} terminou de baixar e está pronta pra instalar.`,
  logErrorMessage: 'Deu erro ao verificar ou baixar a atualização.'
} as const;
