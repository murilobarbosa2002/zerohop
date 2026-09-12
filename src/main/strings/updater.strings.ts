export const UPDATER_STRINGS = {
  dialogType: 'info',
  dialogTitle: 'Atualização disponível',
  dialogMessage: 'Uma nova versão do ScreenShare foi baixada. Reiniciar agora pra atualizar?',
  restartNowButton: 'Reiniciar agora',
  restartLaterButton: 'Depois',
  notificationTitle: 'ScreenShare — atualização pronta',
  notificationBody: (version: string) => `A versão ${version} foi baixada. Clique pra reiniciar e atualizar.`
} as const;
