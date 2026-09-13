import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '@/index.css';

console.log('%c[build] ZeroHop v0.30.2', 'font-weight:bold;color:#7c6cff');

const container = document.getElementById('root');
if (!container) throw new Error('Elemento root não encontrado');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
