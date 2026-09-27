import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '@pulsarr/shared';
import { Toaster } from '~/components/ui/sonner';
import { themeScript } from '~/hooks/use-theme';
import '~/styles/globals.css';

export const Route = createRootRoute({
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

  return (
    <html lang={i18n.language} suppressHydrationWarning>
      <head>
        <meta name="description" content={t('appDescription')} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Outlet />
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
