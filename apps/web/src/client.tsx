import { hydrateRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { StartClient } from '@tanstack/react-start/client';

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);
