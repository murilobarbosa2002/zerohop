import { createTV } from 'tailwind-variants';

/**
 * `tv()` pré-configurado pra reconhecer os tokens customizados de `tailwind.config.js`.
 * Sem isso, o `tailwind-merge` (usado por baixo dos panos pelo `tailwind-variants`) não sabe
 * que `text-badge-xs` é um tamanho de fonte e `text-text-on-accent` é uma cor — os dois caem
 * no mesmo grupo de conflito genérico, e o `tv()` descarta silenciosamente um dos dois.
 * Todo `.variants.ts` do projeto deve importar `tv` daqui, nunca direto de `tailwind-variants`.
 */
export const tv = createTV({
  twMergeConfig: {
    extend: {
      theme: {
        color: [
          'bg',
          'panel',
          'panel-2',
          'border',
          'text',
          'text-on-accent',
          'text-dim',
          'accent',
          'accent-2',
          'accent-soft',
          'success',
          'warn',
          'danger',
          'input-bg',
          'placeholder',
          'hover-panel',
          'hover-danger-bg',
          'hover-danger-border',
          'source-hover-border',
          'status-dot-idle',
          'focus-ring',
          'bevel-light',
          'bevel-dark',
          'bevel-darker'
        ],
        spacing: [
          'titlebar-height',
          'logo-badge',
          'window-button-width',
          'avatar-size',
          'volume-button-size',
          'source-thumbnail-height',
          'source-card-width',
          'status-dot-size',
          'card-padding-y',
          'badge-size',
          'unread-badge-min-width',
          'form-column',
          'form-column-wide',
          'self-preview-width',
          'self-preview-height',
          'preview-lightbox-width',
          'room-sidebar-width',
          'video-min',
          'video',
          'lightbox-video',
          'chat-bubble',
          'modal',
          'contacts-screen'
        ],
        text: ['label-xs', 'body-xs', 'body-sm', 'body-sm-alt', 'badge-xs', 'badge-xxs'],
        radius: ['card', 'button', 'window-icon', 'source-card'],
        shadow: ['glow-accent', 'glow-success']
      }
    }
  }
});
