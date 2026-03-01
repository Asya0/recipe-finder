import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './configs/configureMobX';
import '@/index.scss';
import '@/styles/styles.scss';
import { AppProviders } from './App/providers/AppProviders';
import { router } from './configs/routes';
import { RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);
