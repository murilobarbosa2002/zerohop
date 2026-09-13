/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#d4d0c8',
        panel: '#d4d0c8',
        'panel-2': '#c0c0c0',
        border: '#404040',
        text: '#000000',
        'text-dim': '#454545',
        accent: '#000080',
        'accent-2': '#1084d0',
        'accent-soft': 'rgba(0, 0, 128, 0.12)',
        success: '#008000',
        warn: '#b45f06',
        danger: '#800000',
        'input-bg': '#ffffff',
        placeholder: '#6d6d6d',
        'hover-panel': '#c8c4bc',
        'hover-danger-bg': '#f0dcdc',
        'hover-danger-border': '#800000',
        'source-hover-border': '#000080',
        'status-dot-idle': '#808080',
        'focus-ring': 'rgba(0, 0, 0, 0.7)',
        'bevel-light': '#ffffff',
        'bevel-dark': '#808080',
        'bevel-darker': '#000000'
      },
      spacing: {
        'titlebar-height': '38px',
        'logo-badge': '18px',
        'window-button-width': '46px',
        'avatar-size': '26px',
        'volume-button-size': '30px',
        'source-thumbnail-height': '72px',
        'source-card-width': '130px',
        'status-dot-size': '9px',
        'card-padding-y': '18px',
        'badge-size': '22px',
        'form-column': '180px',
        'form-column-wide': '280px',
        'self-preview-width': '160px',
        'self-preview-height': '90px',
        'preview-lightbox-width': '960px',
        'room-sidebar-width': '260px'
      },
      fontSize: {
        'label-xs': '9.5px',
        'body-xs': '11px',
        'body-sm': '13px',
        'body-sm-alt': '13.5px',
        'badge-xs': '10.5px'
      },
      fontFamily: {
        sans: ['"Jersey10"', '"Segoe UI"', 'Tahoma', 'sans-serif']
      },
      borderRadius: {
        card: '0px',
        button: '0px',
        'window-icon': '0px',
        'source-card': '0px'
      },
      boxShadow: {
        'glow-accent': 'inset -1px -1px 0 #000000, inset 1px 1px 0 #ffffff',
        'glow-success': 'none'
      },
      height: {
        'video-default': '55vh'
      },
      minHeight: {
        'video-min': '180px'
      },
      maxHeight: {
        video: '55vh'
      },
      maxWidth: {
        'chat-bubble': '80%',
        modal: '360px'
      }
    }
  },
  plugins: []
};
