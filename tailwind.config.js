/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0d17',
        panel: '#141728',
        'panel-2': '#1b1f36',
        border: '#262b48',
        text: '#eef0fb',
        'text-dim': '#9aa0c3',
        accent: '#7c6cff',
        'accent-2': '#4f8cff',
        'accent-soft': 'rgba(124, 108, 255, 0.15)',
        success: '#4ee3b0',
        warn: '#ffb454',
        danger: '#e5484d',
        'input-bg': '#0c0e1a',
        placeholder: '#565c80',
        'hover-panel': '#202546',
        'hover-danger-bg': '#2a1620',
        'hover-danger-border': '#e5484d',
        'source-hover-border': '#3a4070',
        'status-dot-idle': '#565c80'
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
        'self-preview-width': '160px',
        'self-preview-height': '90px',
        'room-sidebar-width': '260px',
        'room-chat-width': '300px'
      },
      fontSize: {
        'label-xs': '9.5px',
        'body-xs': '11px',
        'body-sm': '13px',
        'body-sm-alt': '13.5px',
        'badge-xs': '10.5px'
      },
      borderRadius: {
        card: '14px',
        button: '9px',
        'window-icon': '5px',
        'source-card': '10px'
      },
      boxShadow: {
        'glow-accent': '0 6px 18px rgba(124, 108, 255, 0.35)',
        'glow-success': '0 0 8px #4ee3b0'
      },
      maxHeight: {
        video: '55vh',
        'source-list': '220px'
      },
      maxWidth: {
        'chat-bubble': '80%',
        modal: '360px'
      }
    }
  },
  plugins: []
};
