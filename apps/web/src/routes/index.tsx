import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation('home');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-5xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-lg text-(--muted-foreground)">{t('subtitle')}</p>
        <div className="flex gap-3 justify-center">
          <a
            href="/api/docs"
            className="inline-flex items-center justify-center rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) hover:opacity-90 transition-opacity"
          >
            {t('cta.apiDocs')}
          </a>
          <a
            href="https://github.com/pulsarr"
            className="inline-flex items-center justify-center rounded-md border border-(--border) px-4 py-2 text-sm font-medium hover:bg-(--accent) transition-colors"
          >
            {t('cta.github')}
          </a>
        </div>
      </div>
    </div>
  );
}
