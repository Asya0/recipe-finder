import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.scss';
import '@/styles/styles.scss';
import { AppProviders } from './App/providers/AppProviders';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);
