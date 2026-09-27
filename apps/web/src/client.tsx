import { hydrateRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { StartClient } from '@tanstack/react-start/client';
import { initI18n } from './i18n';

initI18n();

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);
