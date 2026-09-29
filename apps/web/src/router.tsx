import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { toast } from '~/components/ui/toast';
import { routeTree } from './routeTree.gen';
import { initI18n } from './i18n';
import { isApiError } from './lib/api-client';

initI18n();

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
      },
      mutations: {
        onError: (err) => {
          const message = isApiError(err) ? err.message : 'An unexpected error occurred.';
          toast.error(message);
        },
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
