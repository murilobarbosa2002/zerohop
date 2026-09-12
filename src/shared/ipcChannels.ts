export const IPC_CHANNELS = {
  getSources: 'get-sources',
  windowMinimize: 'win-minimize',
  windowMaximize: 'win-maximize',
  windowClose: 'win-close',
  updaterCheck: 'updater-check',
  updaterInstall: 'updater-install',
  updaterGetInfo: 'updater-get-info',
  updaterSetAutoUpdateEnabled: 'updater-set-auto-update-enabled',
  updaterStatus: 'updater-status',
  openExternalUrl: 'open-external-url'
} as const;
