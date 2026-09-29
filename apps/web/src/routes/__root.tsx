import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '@pulsarr/shared';
import { Toaster } from '~/components/ui/toast';
import { themeScript } from '~/hooks/use-theme';
import { localeScript } from '~/i18n/config';
import { DefaultCatchBoundary } from '~/components/default-catch-boundary';
import { NotFound } from '~/components/not-found';
import '~/styles/globals.css';

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: APP_NAME },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { i18n, t } = useTranslation();
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <html lang={i18n.language} suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript + localeScript }} />
          <meta name="description" content={t('appDescription')} />
          <HeadContent />
        </head>
        <body className="min-h-screen bg-background text-foreground antialiased">
          <Outlet />
          <Toaster />
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  );
}
