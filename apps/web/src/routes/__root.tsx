import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '@pulsarr/shared';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: APP_NAME },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
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
        <HeadContent />
      </head>
      <body className="min-h-screen bg-(--background) text-(--foreground) antialiased">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
