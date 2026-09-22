import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getUiScale } from '@/services/uiScalePreference';
import { playAppOpenSound, playAppCloseSound } from '@/services/soundEffects';
import '@/index.css';

console.log('%c[build] ZeroHop v0.36.33', 'font-weight:bold;color:#000080');

window.api.setUiZoomFactor(getUiScale());
playAppOpenSound();
window.api.onAppClosing(() => playAppCloseSound());

const container = document.getElementById('root');
if (!container) throw new Error('Elemento root não encontrado');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
